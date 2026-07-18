function buildClassCode(className, logic, bone, lockMode, recoil, extra, speed, fov, smoothVal, maxDist, funcStr) {
    var sensitivity = 1.0 + Math.random() * 0.8;
    var smoothTime = 0.03 + Math.random() * 0.07;
    var deadZone = 0.001 + Math.random() * 0.003;
    var maxStep = 5 + Math.random() * 10;
    var assistStrength = 0.1 + Math.random() * 0.3;
    var damping = 0.7 + Math.random() * 0.25;
    var predictionWeight = 0.2 + Math.random() * 0.6;
    var stabilizationSpeed = 5 + Math.random() * 10;
    var noiseThreshold = 0.01 + Math.random() * 0.04;
    var returnSpeed = 2 + Math.random() * 6;
    var preciseSensitivity = 0.3 + Math.random() * 0.4;
    var adaptiveSpeed = 3 + Math.random() * 5;
    var focusStrength = 0.1 + Math.random() * 0.2;
    var microShakeReduction = 0.7 + Math.random() * 0.25;
    var pullUpSpeed = 1.5 + Math.random() * 2.5;
    var maxPullDistance = 80 + Math.random() * 40;
    var aimSmoothness = 4 + Math.random() * 8;
    var fovAdjust = 0.8 + Math.random() * 0.4;
    var recoilCompensation = 0.3 + Math.random() * 0.5;
    var gravityCompensation = 0.1 + Math.random() * 0.2;
    var targetLeadFactor = 0.3 + Math.random() * 0.5;
    var snapSpeed = 15 + Math.random() * 20;
    var recoilReduction = 0.3 + Math.random() * 0.5;
    var recoilRecoverySpeed = 2 + Math.random() * 4;
    var verticalRecoilReduction = 0.2 + Math.random() * 0.4;
    var horizontalRecoilReduction = 0.3 + Math.random() * 0.4;
    var burstRecoilControl = 0.1 + Math.random() * 0.3;
    var recoilSmoothing = 0.1 + Math.random() * 0.2;

    if (extra === 'NheTam') {
        sensitivity = 1.6 + Math.random() * 0.4;
        smoothTime = 0.02 + Math.random() * 0.03;
        deadZone = 0.0005 + Math.random() * 0.001;
        maxStep = 12 + Math.random() * 6;
        damping = 0.85 + Math.random() * 0.1;
        focusStrength = 0.05 + Math.random() * 0.1;
        microShakeReduction = 0.9 + Math.random() * 0.08;
    }
    if (extra === 'BamDau' || extra === 'LockHead' || extra === 'HeadSnap') {
        sensitivity = 1.8 + Math.random() * 0.5;
        smoothTime = 0.01 + Math.random() * 0.02;
        deadZone = 0.0003 + Math.random() * 0.0005;
        maxStep = 20 + Math.random() * 8;
        assistStrength = 0.5 + Math.random() * 0.3;
        predictionWeight = 0.7 + Math.random() * 0.2;
        snapSpeed = 25 + Math.random() * 15;
    }
    if (extra === 'Aimlock') {
        sensitivity = 1.2 + Math.random() * 0.3;
        smoothTime = 0.025 + Math.random() * 0.025;
        assistStrength = 0.6 + Math.random() * 0.2;
        predictionWeight = 0.8 + Math.random() * 0.15;
        targetLeadFactor = 0.5 + Math.random() * 0.3;
    }
    if (extra === 'FixRung' || extra === 'Stabilizer') {
        damping = 0.9 + Math.random() * 0.08;
        stabilizationSpeed = 12 + Math.random() * 8;
        noiseThreshold = 0.02 + Math.random() * 0.03;
        microShakeReduction = 0.92 + Math.random() * 0.07;
    }
    if (extra === 'DamTam') {
        sensitivity = 0.5 + Math.random() * 0.3;
        smoothTime = 0.06 + Math.random() * 0.04;
        deadZone = 0.003 + Math.random() * 0.003;
        maxStep = 4 + Math.random() * 3;
        damping = 0.5 + Math.random() * 0.2;
    }
    if (extra === 'KeoTam') {
        sensitivity = 2.0 + Math.random() * 0.6;
        smoothTime = 0.015 + Math.random() * 0.015;
        deadZone = 0.0002 + Math.random() * 0.0003;
        maxStep = 25 + Math.random() * 10;
        returnSpeed = 1 + Math.random() * 2;
        focusStrength = 0.2 + Math.random() * 0.15;
    }
    if (extra === 'FreeFirePro') {
        sensitivity = 1.5 + Math.random() * 0.4;
        smoothTime = 0.02 + Math.random() * 0.02;
        deadZone = 0.0005 + Math.random() * 0.0005;
        maxStep = 18 + Math.random() * 6;
        assistStrength = 0.7 + Math.random() * 0.2;
        predictionWeight = 0.9 + Math.random() * 0.08;
        damping = 0.9 + Math.random() * 0.05;
        targetLeadFactor = 0.6 + Math.random() * 0.3;
        recoilCompensation = 0.5 + Math.random() * 0.4;
        recoilReduction = 0.6 + Math.random() * 0.3;
    }
    if (extra === 'ToiUuMay' || extra === 'TangFPS') {
        sensitivity = 1.3 + Math.random() * 0.3;
        smoothTime = 0.01 + Math.random() * 0.01;
        deadZone = 0.0003 + Math.random() * 0.0003;
        maxStep = 22 + Math.random() * 6;
    }
    if (extra === 'AntiLag') {
        damping = 0.95 + Math.random() * 0.04;
        stabilizationSpeed = 18 + Math.random() * 6;
        noiseThreshold = 0.03 + Math.random() * 0.02;
        smoothTime = 0.01 + Math.random() * 0.01;
    }
    if (extra === 'NoSpread') {
        sensitivity = 1.0 + Math.random() * 0.2;
        smoothTime = 0.025 + Math.random() * 0.025;
        maxStep = 15 + Math.random() * 5;
    }
    if (extra === 'RapidFire') {
        sensitivity = 1.6 + Math.random() * 0.4;
        smoothTime = 0.015 + Math.random() * 0.015;
        maxStep = 28 + Math.random() * 8;
        assistStrength = 0.3 + Math.random() * 0.2;
        recoilReduction = 0.4 + Math.random() * 0.3;
        verticalRecoilReduction = 0.3 + Math.random() * 0.3;
    }

    return `using System;
using System.Collections.Generic;
using UnityEngine;

public class ${className} : MonoBehaviour
{
    public float sensitivity = ${sensitivity.toFixed(3)}f;
    public float smoothTime = ${smoothTime.toFixed(3)}f;
    public float deadZone = ${deadZone.toFixed(4)}f;
    public float maxStep = ${maxStep.toFixed(1)}f;
    public float assistStrength = ${assistStrength.toFixed(2)}f;
    public float damping = ${damping.toFixed(2)}f;
    public float predictionWeight = ${predictionWeight.toFixed(2)}f;
    public float stabilizationSpeed = ${stabilizationSpeed.toFixed(1)}f;
    public float noiseThreshold = ${noiseThreshold.toFixed(3)}f;
    public float returnSpeed = ${returnSpeed.toFixed(1)}f;
    public float preciseSensitivity = ${preciseSensitivity.toFixed(2)}f;
    public float adaptiveSpeed = ${adaptiveSpeed.toFixed(1)}f;
    public float focusStrength = ${focusStrength.toFixed(2)}f;
    public float microShakeReduction = ${microShakeReduction.toFixed(2)}f;
    public float pullUpSpeed = ${pullUpSpeed.toFixed(1)}f;
    public float maxPullDistance = ${maxPullDistance.toFixed(1)}f;
    public float aimSmoothness = ${aimSmoothness.toFixed(1)}f;
    public float fovAdjust = ${fovAdjust.toFixed(2)}f;
    public float recoilCompensation = ${recoilCompensation.toFixed(2)}f;
    public float gravityCompensation = ${gravityCompensation.toFixed(2)}f;
    public float targetLeadFactor = ${targetLeadFactor.toFixed(2)}f;
    public float snapSpeed = ${snapSpeed.toFixed(1)}f;
    public float recoilReduction = ${recoilReduction.toFixed(2)}f;
    public float recoilRecoverySpeed = ${recoilRecoverySpeed.toFixed(1)}f;
    public float verticalRecoilReduction = ${verticalRecoilReduction.toFixed(2)}f;
    public float horizontalRecoilReduction = ${horizontalRecoilReduction.toFixed(2)}f;
    public float burstRecoilControl = ${burstRecoilControl.toFixed(2)}f;
    public float recoilSmoothing = ${recoilSmoothing.toFixed(2)}f;

    private Vector2 lastPos;
    private Vector2 velocity;
    private Vector2 filteredInput;
    private Vector2 smoothVelocity;
    private Vector2 focusCenter;
    private Vector2 currentFocus;
    private bool active;
    private float idleTime;
    private bool precisionMode;
    private float currentSensitivity;
    private Vector2 kalmanX;
    private float kalmanP = 1f;
    private Queue<Vector2> sampleBuffer;
    private int bufferSize = 5;
    private bool isPullingUp;
    private float pullUpAmount;
    private Transform target;
    private Vector3 lastTargetPos;
    private Vector3 targetVelocity;
    private float fireTimer;
    private bool isFiring;
    private float recoilOffset;
    private float verticalRecoilOffset;
    private float horizontalRecoilOffset;
    private int burstCount;
    private float burstTimer;
    private float recoilSmoothVelocity;

    void Awake()
    {
        Application.targetFrameRate = 120;
        QualitySettings.vSyncCount = 0;
        sampleBuffer = new Queue<Vector2>(bufferSize);
        currentSensitivity = sensitivity;
        currentFocus = Vector2.zero;
        focusCenter = Vector2.zero;
        if ("${extra}" == "RapidFire") InvokeRepeating(nameof(RapidFireCheck), 0.05f, 0.04f);
        if ("${extra}" == "FreeFirePro" || "${extra}" == "BamDau" || "${extra}" == "LockHead") 
            InvokeRepeating(nameof(FindTarget), 0.05f, 0.05f);
    }

    void Update()
    {
        Vector2 rawInput = GetRawInput();
        rawInput = ApplyDeadzone(rawInput);
        rawInput = ApplyNoiseFilter(rawInput);
        rawInput = ApplyMovingAverage(rawInput);
        rawInput = ApplyKalman(rawInput);
        rawInput = ApplyFocusAssist(rawInput);
        rawInput = ApplyAdaptiveSensitivity(rawInput);
        rawInput = ApplyPrecisionMode(rawInput);
        rawInput = ApplySmoothing(rawInput);
        rawInput = ApplyStabilization(rawInput);
        rawInput = ApplyPullUp(rawInput);
        rawInput = ApplyRecoilCompensation(rawInput);
        rawInput = ApplyGravityCompensation(rawInput);
        rawInput = ApplyRecoilReduction(rawInput);
        rawInput *= damping;
        rawInput = Vector2.ClampMagnitude(rawInput, maxStep);
        rawInput = ApplyPrediction(rawInput);
        ApplyRotation(rawInput);
        ApplyAimAssist();
        HandleTrigger();
        ManageRecoil();
    }

    Vector2 GetRawInput()
    {
        if (Input.touchCount > 0)
        {
            Touch t = Input.GetTouch(0);
            if (t.phase == TouchPhase.Began)
            {
                lastPos = t.position;
                velocity = Vector2.zero;
                active = true;
                return Vector2.zero;
            }
            if (!active || t.phase == TouchPhase.Canceled || t.phase == TouchPhase.Ended)
            {
                active = false;
                return Vector2.zero;
            }
            Vector2 delta = t.position - lastPos;
            lastPos = t.position;
            if (t.deltaPosition.y > 2f) isPullingUp = true;
            else isPullingUp = false;
            return delta;
        }
        else
        {
            float mx = Input.GetAxis("Mouse X");
            float my = Input.GetAxis("Mouse Y");
            if (Mathf.Abs(mx) < 0.001f && Mathf.Abs(my) < 0.001f)
            {
                active = false;
                isPullingUp = false;
                return Vector2.zero;
            }
            active = true;
            if (my > 2f) isPullingUp = true;
            else isPullingUp = false;
            return new Vector2(mx, my) * 2f;
        }
    }

    Vector2 ApplyDeadzone(Vector2 input)
    {
        float mag = input.magnitude;
        if (mag < deadZone) return Vector2.zero;
        float adjusted = (mag - deadZone) / (1f - deadZone);
        return input.normalized * adjusted;
    }

    Vector2 ApplyNoiseFilter(Vector2 input)
    {
        Vector2 delta = input - filteredInput;
        if (delta.magnitude < noiseThreshold) return filteredInput;
        filteredInput = Vector2.Lerp(filteredInput, input, 0.3f);
        return filteredInput * microShakeReduction;
    }

    Vector2 ApplyMovingAverage(Vector2 input)
    {
        sampleBuffer.Enqueue(input);
        Vector2 sum = Vector2.zero;
        foreach (Vector2 v in sampleBuffer) sum += v;
        if (sampleBuffer.Count > bufferSize) sampleBuffer.Dequeue();
        return sum / sampleBuffer.Count;
    }

    Vector2 ApplyKalman(Vector2 input)
    {
        float q = 0.001f;
        float r = 0.1f;
        kalmanP = kalmanP + q;
        float k = kalmanP / (kalmanP + r);
        kalmanX = kalmanX + k * (input - kalmanX);
        kalmanP = (1 - k) * kalmanP;
        return kalmanX;
    }

    Vector2 ApplyFocusAssist(Vector2 input)
    {
        focusCenter = Vector2.zero;
        if (target != null)
        {
            Vector3 targetScreenPos = Camera.main.WorldToScreenPoint(target.position);
            focusCenter = new Vector2(targetScreenPos.x - Screen.width / 2f, targetScreenPos.y - Screen.height / 2f);
        }
        currentFocus = currentFocus * (1 - focusStrength) + focusCenter * focusStrength;
        float distanceToCenter = Vector2.Distance(currentFocus, focusCenter);
        float speedFactor = Mathf.Clamp(1f - (distanceToCenter / 500f), 0.3f, 1f);
        return input * speedFactor;
    }

    Vector2 ApplyAdaptiveSensitivity(Vector2 input)
    {
        float targetSensitivity = sensitivity;
        if (Input.GetKey(KeyCode.LeftShift)) targetSensitivity = preciseSensitivity;
        if (target != null)
        {
            float dist = Vector3.Distance(transform.position, target.position);
            float normalizedDist = Mathf.Clamp01(dist / 100f);
            targetSensitivity = Mathf.Lerp(preciseSensitivity, sensitivity, normalizedDist);
        }
        currentSensitivity = Mathf.Lerp(currentSensitivity, targetSensitivity, adaptiveSpeed * Time.deltaTime);
        return input * currentSensitivity;
    }

    Vector2 ApplyPrecisionMode(Vector2 input)
    {
        if (Input.GetKeyDown(KeyCode.P)) precisionMode = !precisionMode;
        float target = precisionMode ? preciseSensitivity : sensitivity;
        currentSensitivity = Mathf.Lerp(currentSensitivity, target, adaptiveSpeed * Time.deltaTime);
        return input * currentSensitivity;
    }

    Vector2 ApplySmoothing(Vector2 input)
    {
        return Vector2.SmoothDamp(Vector2.zero, input, ref velocity, smoothTime, Mathf.Infinity, Time.unscaledDeltaTime);
    }

    Vector2 ApplyStabilization(Vector2 input)
    {
        if (input.magnitude > 0.08f)
        {
            idleTime = 0f;
            return input;
        }
        idleTime += Time.deltaTime;
        if (idleTime > 0.5f)
        {
            return Vector2.Lerp(input, Vector2.zero, returnSpeed * Time.deltaTime);
        }
        return input;
    }

    Vector2 ApplyPullUp(Vector2 input)
    {
        if (isPullingUp && pullUpAmount < 1f)
            pullUpAmount += Time.deltaTime * pullUpSpeed;
        else if (!isPullingUp && pullUpAmount > 0f)
            pullUpAmount -= Time.deltaTime * pullUpSpeed * 2f;
        pullUpAmount = Mathf.Clamp01(pullUpAmount);
        return input + new Vector2(0, pullUpAmount * 0.5f);
    }

    Vector2 ApplyRecoilCompensation(Vector2 input)
    {
        if (isFiring)
        {
            fireTimer += Time.deltaTime;
            float recoilAmount = Mathf.Sin(fireTimer * 12f) * recoilCompensation * 0.01f;
            float verticalRecoil = Mathf.Sin(fireTimer * 8f + 1.5f) * recoilCompensation * 0.008f;
            float horizontalRecoil = Mathf.Cos(fireTimer * 10f + 2f) * recoilCompensation * 0.006f;
            return input + new Vector2(horizontalRecoil, verticalRecoil + recoilAmount);
        }
        return input;
    }

    Vector2 ApplyRecoilReduction(Vector2 input)
    {
        if (isFiring)
        {
            float reductionFactor = 1f - recoilReduction;
            float verticalFactor = 1f - verticalRecoilReduction;
            float horizontalFactor = 1f - horizontalRecoilReduction;
            
            float smoothedRecoil = Mathf.SmoothDamp(recoilOffset, 0f, ref recoilSmoothVelocity, recoilSmoothing);
            recoilOffset = smoothedRecoil;
            
            Vector2 reducedInput = input;
            reducedInput.x *= horizontalFactor;
            reducedInput.y *= verticalFactor;
            
            if (reducedInput.y > 0) reducedInput.y *= reductionFactor;
            
            if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
            {
                burstCount++;
                burstTimer = 0f;
                if (burstCount > 3)
                {
                    reducedInput.y *= (1f - burstRecoilControl);
                    burstCount = 0;
                }
            }
            
            return reducedInput;
        }
        else
        {
            recoilOffset = Mathf.Lerp(recoilOffset, 0f, recoilRecoverySpeed * Time.deltaTime);
            return input;
        }
    }

    Vector2 ApplyGravityCompensation(Vector2 input)
    {
        if (target != null)
        {
            float angle = Vector3.Angle(transform.forward, (target.position - transform.position).normalized);
            float gravityFactor = Mathf.Clamp01(angle / 30f) * gravityCompensation;
            return input + new Vector2(0, gravityFactor);
        }
        return input;
    }

    Vector2 ApplyPrediction(Vector2 input)
    {
        if (target != null && predictionWeight > 0.1f)
        {
            Vector3 currentPos = target.position;
            Vector3 vel = (currentPos - lastTargetPos) / Time.deltaTime;
            lastTargetPos = currentPos;
            targetVelocity = Vector3.Lerp(targetVelocity, vel, 0.1f);
            float timeToTarget = Vector3.Distance(transform.position, currentPos) / (sensitivity * 2f);
            Vector3 predictedPos = currentPos + targetVelocity * timeToTarget * targetLeadFactor;
            Vector3 screenPred = Camera.main.WorldToScreenPoint(predictedPos);
            Vector2 screenCenter = new Vector2(Screen.width / 2f, Screen.height / 2f);
            Vector2 predDelta = (new Vector2(screenPred.x, screenPred.y) - screenCenter) * 0.01f;
            return input + predDelta * predictionWeight;
        }
        return input;
    }

    void ApplyRotation(Vector2 delta)
    {
        Vector3 euler = transform.eulerAngles;
        float sensitivityFactor = 1f;
        if (target != null && assistStrength > 0.1f)
        {
            Vector3 targetDir = (target.position - transform.position).normalized;
            float angle = Vector3.Angle(transform.forward, targetDir);
            if (angle < 30f)
            {
                sensitivityFactor = 1f + (1f - angle / 30f) * assistStrength;
            }
        }
        euler.x -= delta.y * sensitivity * 0.1f * sensitivityFactor;
        euler.y += delta.x * sensitivity * 0.1f * sensitivityFactor;
        euler.x = Mathf.Clamp(euler.x, -90f, 90f);
        transform.eulerAngles = euler;
    }

    void ApplyAimAssist()
    {
        if (target == null || assistStrength < 0.01f) return;
        Vector3 targetDir = (target.position - transform.position).normalized;
        float angle = Vector3.Angle(transform.forward, targetDir);
        if (angle < 15f)
        {
            float strength = Mathf.Clamp01(1f - angle / 15f) * assistStrength;
            Quaternion targetRot = Quaternion.LookRotation(targetDir);
            transform.rotation = Quaternion.Slerp(transform.rotation, targetRot, strength * Time.deltaTime * snapSpeed);
        }
    }

    void HandleTrigger()
    {
        if (target == null) return;
        float angle = Vector3.Angle(transform.forward, (target.position - transform.position).normalized);
        if (angle < 5f && Vector3.Distance(transform.position, target.position) < 30f)
        {
            if (Input.GetButton("Fire1") || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Stationary))
            {
                isFiring = true;
                burstTimer += Time.deltaTime;
            }
            else
            {
                isFiring = false;
            }
        }
        else
        {
            isFiring = false;
        }
    }

    void ManageRecoil()
    {
        if (isFiring)
        {
            verticalRecoilOffset = Mathf.Clamp(verticalRecoilOffset, -0.5f, 0.5f);
            horizontalRecoilOffset = Mathf.Clamp(horizontalRecoilOffset, -0.3f, 0.3f);
        }
    }

    void FindTarget()
    {
        GameObject[] enemies = GameObject.FindGameObjectsWithTag("Enemy");
        Transform best = null;
        float bestScore = float.MaxValue;
        foreach (var e in enemies)
        {
            float d = Vector3.Distance(transform.position, e.transform.position);
            if (d > maxPullDistance) continue;
            float a = Vector3.Angle(transform.forward, e.transform.position - transform.position);
            if (a > 60f) continue;
            float score = d + a * 0.5f;
            if (score < bestScore) { bestScore = score; best = e.transform; }
        }
        if (best != target)
        {
            target = best;
            lastTargetPos = target != null ? target.position : Vector3.zero;
            targetVelocity = Vector3.zero;
        }
    }

    void RapidFireCheck()
    {
        if (target != null)
        {
            float angle = Vector3.Angle(transform.forward, (target.position - transform.position).normalized);
            if (angle < 12f) Debug.Log("[${className}] RapidFire");
        }
    }

    void OnDrawGizmos()
    {
        Gizmos.color = Color.cyan;
        Gizmos.DrawWireSphere(transform.position, maxPullDistance);
        if (target != null)
        {
            Gizmos.color = Color.red;
            Gizmos.DrawLine(transform.position, target.position);
        }
    }
}`;
}