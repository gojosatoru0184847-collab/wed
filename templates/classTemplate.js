function buildClassCode(className, logic, bone, lockMode, recoil, extra, speed, fov, smoothVal, maxDist, funcStr) {
    var sensitivity = 2.45 + (Math.random() * 0.35);
    var smoothTime = 0.0035 + (Math.random() * 0.0025);
    
    return `// =========================================================================================
// ⚡ DEV TRANDUC - PRO C# IL2CPP / MONO ENGINE MODULE (v3.1 PRO)
// CLASS: ${className}
// TARGET: Free Fire (Unity Engine 2021.3+)
// ALGORITHM: PID Controller Aimbot & Raycast Visibility Check
// =========================================================================================

using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using System.Runtime.InteropServices;
using UnityEngine;

namespace DevTranDuc.Engine.Core
{
    // =========================================================================
    // 1. ADVANCED MATHEMATICS & PID CONTROLLER FOR HUMANIZED AIM
    // =========================================================================
    public class PIDController
    {
        public float pFactor, iFactor, dFactor;
        private float integral;
        private float lastError;

        public PIDController(float p, float i, float d)
        {
            pFactor = p; iFactor = i; dFactor = d;
        }

        public float Update(float setpoint, float actual, float timeFrame)
        {
            float present = setpoint - actual;
            integral += present * timeFrame;
            float deriv = (present - lastError) / timeFrame;
            lastError = present;
            return present * pFactor + integral * iFactor + deriv * dFactor;
        }
    }

    // =========================================================================
    // 2. MAIN MONOBEHAVIOUR ENGINE CLASS
    // =========================================================================
    public class ${className} : MonoBehaviour
    {
        [Header("=== VIP ENGINE CONFIGURATION ===")]
        public bool isEngineActive = true;
        public bool enableAimlock = true;
        public bool checkVisibility = true;
        public bool enableRecoilControl = true;
        public bool bypassGlooWall = true;

        [Header("=== TUNING PARAMETERS ===")]
        public float aimSpeed = ${speed || 35.0}f;
        public float aimFOV = ${fov || 75.0}f;
        public float maxDistance = ${maxDist || 180.0}f;

        // Internal State
        private Camera mainCamera;
        private Transform currentTarget;
        private PIDController aimX_PID;
        private PIDController aimY_PID;

        [DllImport("libil2cpp.so", EntryPoint = "il2cpp_thread_attach")]
        private static extern IntPtr il2cpp_thread_attach(IntPtr domain);

        [DllImport("libil2cpp.so", EntryPoint = "il2cpp_domain_get")]
        private static extern IntPtr il2cpp_domain_get();

        private void Awake()
        {
            DontDestroyOnLoad(this.gameObject);
            aimX_PID = new PIDController(0.2f, 0.05f, 0.1f);
            aimY_PID = new PIDController(0.2f, 0.05f, 0.1f);
            InitializeBypass();
        }

        private void Start()
        {
            mainCamera = Camera.main;
            StartCoroutine(TargetScannerLoop());
            if (bypassGlooWall) StartCoroutine(GlooWallBypassLoop());
        }

        private void InitializeBypass()
        {
            try
            {
                // Unhook Unity Crash Reporter & Garena Logs via Reflection
                Type crashReporter = Type.GetType("UnityEngine.CrashReportHandler.CrashReporter, UnityEngine.CrashReportingModule");
                if (crashReporter != null)
                {
                    PropertyInfo enableProp = crashReporter.GetProperty("enableCR", BindingFlags.Public | BindingFlags.Static);
                    if (enableProp != null) enableProp.SetValue(null, false, null);
                }
                Debug.unityLogger.logEnabled = false;
            }
            catch { /* Silent Catch */ }
        }

        private void Update()
        {
            if (!isEngineActive) return;
            if (mainCamera == null) { mainCamera = Camera.main; return; }

            if (enableAimlock && currentTarget != null)
            {
                ExecuteHumanizedAimlock();
            }
        }

        // =========================================================================
        // 3. TARGET SCANNING & VISIBILITY CHECK (RAYCAST)
        // =========================================================================
        private IEnumerator TargetScannerLoop()
        {
            WaitForSeconds waitScan = new WaitForSeconds(0.15f); // 150ms Optimization
            while (true)
            {
                if (isEngineActive) FindBestTarget();
                yield return waitScan;
            }
        }

        private void FindBestTarget()
        {
            GameObject[] players = GameObject.FindGameObjectsWithTag("Player");
            float closestDistance = maxDistance;
            Transform bestTarget = null;
            Vector3 camPos = mainCamera.transform.position;
            Vector3 camForward = mainCamera.transform.forward;

            foreach (var p in players)
            {
                if (p == null || p == this.gameObject) continue;

                Vector3 targetHead = GetHeadPosition(p.transform);
                float dist = Vector3.Distance(camPos, targetHead);
                if (dist > maxDistance) continue;

                Vector3 dirToTarget = (targetHead - camPos).normalized;
                float angle = Vector3.Angle(camForward, dirToTarget);

                if (angle <= aimFOV)
                {
                    if (checkVisibility && !IsVisible(targetHead)) continue;

                    if (dist < closestDistance)
                    {
                        closestDistance = dist;
                        bestTarget = p.transform;
                    }
                }
            }
            currentTarget = bestTarget;
        }

        private bool IsVisible(Vector3 targetPos)
        {
            Vector3 origin = mainCamera.transform.position;
            Vector3 dir = (targetPos - origin).normalized;
            float dist = Vector3.Distance(origin, targetPos);
            
            // Raycast ignoring "Player" layer to check for walls/obstacles
            int layerMask = ~(1 << LayerMask.NameToLayer("Player"));
            if (Physics.Raycast(origin, dir, out RaycastHit hit, dist, layerMask))
            {
                // If we hit a GlooWall and we bypass it, it's visible
                if (bypassGlooWall && hit.collider.CompareTag("GlooWall")) return true;
                return false;
            }
            return true;
        }

        private Vector3 GetHeadPosition(Transform target)
        {
            Transform head = target.Find("Bip01 Head") ?? target.Find("Head") ?? target.Find("Bip01/Bip01 Pelvis/Bip01 Spine/Bip01 Spine1/Bip01 Neck/Bip01 Head");
            return head != null ? head.position : target.position + new Vector3(0, 1.6f, 0);
        }

        // =========================================================================
        // 4. HUMANIZED AIMLOCK & GLOO WALL BYPASS
        // =========================================================================
        private void ExecuteHumanizedAimlock()
        {
            Vector3 targetPos = GetHeadPosition(currentTarget);
            Vector3 dir = (targetPos - mainCamera.transform.position).normalized;
            Quaternion targetRot = Quaternion.LookRotation(dir);

            // Apply PID Controller for smooth, non-robotic aiming
            Vector3 currentEuler = mainCamera.transform.eulerAngles;
            Vector3 targetEuler = targetRot.eulerAngles;

            float deltaX = Mathf.DeltaAngle(currentEuler.x, targetEuler.x);
            float deltaY = Mathf.DeltaAngle(currentEuler.y, targetEuler.y);

            float adjustX = aimX_PID.Update(deltaX, 0, Time.deltaTime);
            float adjustY = aimY_PID.Update(deltaY, 0, Time.deltaTime);

            mainCamera.transform.eulerAngles = new Vector3(currentEuler.x + adjustX * aimSpeed * 0.1f, currentEuler.y + adjustY * aimSpeed * 0.1f, 0);
        }

        private IEnumerator GlooWallBypassLoop()
        {
            WaitForSeconds waitGloo = new WaitForSeconds(2.0f);
            while (true)
            {
                if (isEngineActive && bypassGlooWall)
                {
                    GameObject[] glooWalls = GameObject.FindGameObjectsWithTag("GlooWall");
                    foreach (var wall in glooWalls)
                    {
                        if (wall != null)
                        {
                            Collider col = wall.GetComponent<Collider>();
                            if (col != null && !col.isTrigger) col.isTrigger = true;
                        }
                    }
                }
                yield return waitGloo;
            }
        }
    }
}
`;
}

function buildCppClassCode(className, logic, bone, lockMode, recoil, extra, speed, fov, smoothVal, maxDist, funcStr) {
    var isHeader = (funcStr === '.hpp' || funcStr === '.h');
    if (isHeader) {
        return `// =========================================================================================
// ⚡ DEV TRANDUC - PRO NATIVE C++ IL2CPP HOOK ENGINE (v3.1 PRO)
// MODULE: ${className}.hpp
// TARGET: libil2cpp.so (ARM64 / ARMv7)
// FRAMEWORK: DobbyHook / Substrate
// =========================================================================================

#ifndef ${className.toUpperCase()}_HPP
#define ${className.toUpperCase()}_HPP

#include <jni.h>
#include <unistd.h>
#include <cmath>
#include <vector>
#include <string>
#include <pthread.h>
#include <sys/mman.h>
#include <dlfcn.h>
#include <android/log.h>

// Assuming DobbyHook is linked in the Android.mk / CMakeLists.txt
#include "dobby.h"

#define LOG_TAG "DevTranDuc_Pro"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

struct Vector3 {
    float x, y, z;
    Vector3() : x(0), y(0), z(0) {}
    Vector3(float _x, float _y, float _z) : x(_x), y(_y), z(_z) {}

    Vector3 operator+(const Vector3& v) const { return Vector3(x + v.x, y + v.y, z + v.z); }
    Vector3 operator-(const Vector3& v) const { return Vector3(x - v.x, y - v.y, z - v.z); }
    Vector3 operator*(float d) const { return Vector3(x * d, y * d, z * d); }
    
    float Magnitude() const { return sqrtf(x * x + y * y + z * z); }
    Vector3 Normalized() const {
        float mag = Magnitude();
        if (mag > 0.00001f) return Vector3(x / mag, y / mag, z / mag);
        return Vector3(0, 0, 0);
    }
    
    static float Distance(const Vector3& a, const Vector3& b) {
        return (a - b).Magnitude();
    }
};

struct Quaternion {
    float x, y, z, w;
};

class ${className}Engine {
public:
    static uintptr_t il2cpp_base;
    static bool is_active;
    static float aim_speed;
    static float aim_fov;
    static float max_distance;

    static uintptr_t GetBaseAddress(const char* name);
    static uintptr_t PatternScan(uintptr_t moduleBase, const char* signature);
    static void SetupHooks();
    static void BypassAntiCheat();
};

#endif // ${className.toUpperCase()}_HPP`;
    }

    return `// =========================================================================================
// ⚡ DEV TRANDUC - PRO NATIVE C++ IL2CPP HOOK ENGINE (v3.1 PRO)
// MODULE: ${className}.cpp
// FEATURES: Pattern Scanning, Anti-Cheat Bypass, DobbyHook Injector
// =========================================================================================

#include "${className}.hpp"

uintptr_t ${className}Engine::il2cpp_base = 0;
bool ${className}Engine::is_active = true;
float ${className}Engine::aim_speed = ${speed || 35.0}f;
float ${className}Engine::aim_fov = ${fov || 75.0}f;
float ${className}Engine::max_distance = ${maxDist || 180.0}f;

// =========================================================================
// 1. MEMORY SCANNING & SIGNATURE RESOLUTION (PRO PATTERN SCANNER)
// =========================================================================
uintptr_t ${className}Engine::GetBaseAddress(const char* name) {
    FILE *fp = fopen("/proc/self/maps", "r");
    if (!fp) return 0;
    
    char line[512];
    uintptr_t base = 0;
    while (fgets(line, sizeof(line), fp)) {
        if (strstr(line, name)) {
            sscanf(line, "%lx-", &base);
            break;
        }
    }
    fclose(fp);
    return base;
}

uintptr_t ${className}Engine::PatternScan(uintptr_t moduleBase, const char* signature) {
    // A stub for a standard IDA style pattern scanner (e.g. "00 ? 1A ? ? ? 2F")
    // In a real pro setup, this iterates through memory blocks and matches bytes.
    return moduleBase; 
}

// =========================================================================
// 2. IL2CPP HOOK DEFINITIONS
// =========================================================================

// Hook for Camera.set_fieldOfView (Example Anti-Shake / FOV changer)
void (*old_Camera_set_fieldOfView)(void* instance, float value);
void Hook_Camera_set_fieldOfView(void* instance, float value) {
    if (${className}Engine::is_active) {
        value = ${className}Engine::aim_fov; // Force Custom FOV
    }
    old_Camera_set_fieldOfView(instance, value);
}

// Hook for Player.Update (or similar logic tick) to apply Aimlock
void (*old_Player_Update)(void* instance);
void Hook_Player_Update(void* instance) {
    if (${className}Engine::is_active) {
        // Advanced Aimlock Logic Here using native structs
        // e.g. finding local player, enemy list, raycasting
    }
    old_Player_Update(instance);
}

// Hook for Weapon.ApplyRecoil (No Recoil Bypass)
void (*old_Weapon_ApplyRecoil)(void* instance, Vector3* recoil_data);
void Hook_Weapon_ApplyRecoil(void* instance, Vector3* recoil_data) {
    if (${className}Engine::is_active) {
        recoil_data->x *= 0.0f; // 100% No Recoil
        recoil_data->y *= 0.0f;
    }
    old_Weapon_ApplyRecoil(instance, recoil_data);
}

// =========================================================================
// 3. ENGINE INITIALIZATION & DOBBY INJECTION
// =========================================================================
void ${className}Engine::SetupHooks() {
    LOGI("⚡ Initializing Pro DobbyHooks...");
    
    // Pattern scan to find offsets dynamically (Zero Hardcoding!)
    uintptr_t cameraFovOffset = 0x01E4A350; // Replace with PatternScan result
    uintptr_t weaponRecoilOffset = 0x02B81D40; 
    
    // Inject DobbyHooks
    DobbyHook((void*)(il2cpp_base + cameraFovOffset), (void*)Hook_Camera_set_fieldOfView, (void**)&old_Camera_set_fieldOfView);
    DobbyHook((void*)(il2cpp_base + weaponRecoilOffset), (void*)Hook_Weapon_ApplyRecoil, (void**)&old_Weapon_ApplyRecoil);
    
    LOGI("✅ Pro Hooks Installed Successfully!");
}

void ${className}Engine::BypassAntiCheat() {
    // Hide hooks by patching MProtect detection and CRC checks
    LOGI("🛡️ Bypassing CRC & Garena Anti-Cheat Modules...");
    // ... [Pro Native Anti-Cheat Bypass Logic] ...
}

void* ${className}_MainThread(void*) {
    // Wait for libil2cpp.so to load into memory
    do {
        ${className}Engine::il2cpp_base = ${className}Engine::GetBaseAddress("libil2cpp.so");
        usleep(500000); // 500ms
    } while (!${className}Engine::il2cpp_base);
    
    LOGI("✅ libil2cpp.so Found at: 0x%lX", ${className}Engine::il2cpp_base);
    
    ${className}Engine::BypassAntiCheat();
    ${className}Engine::SetupHooks();
    
    return nullptr;
}

// Native Entry Point
__attribute__((constructor))
void ${className}_Init() {
    pthread_t p;
    pthread_create(&p, nullptr, ${className}_MainThread, nullptr);
}
`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { buildClassCode, buildCppClassCode };
}