import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

const LAYER_COUNT = 3;
const NEURONS_PER_LAYER = 5;
const TOTAL_NEURONS = LAYER_COUNT * NEURONS_PER_LAYER;

const SIGNAL_SPEED = 1.5;
const ROTATION_SMOOTHING = 0.0005;

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    precision highp float;
    
    #define LAYER_COUNT ${LAYER_COUNT}
    #define NEURONS_PER_LAYER ${NEURONS_PER_LAYER}
    
    uniform vec2 uNeurons[${TOTAL_NEURONS}];
    uniform vec3 uColor;
    uniform vec3 uBgColor;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uSignalProgress; 
    uniform float uSignalAngle;    

    varying vec2 vUv;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float sdSegment(in vec2 p, in vec2 a, in vec2 b) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
    }

    float dither4x4(vec2 position, float brightness) {
        int x = int(mod(position.x, 4.0));
        int y = int(mod(position.y, 4.0));
        int index = x + y * 4;
        float limit = 0.0;

        if (x < 8) {
            if (index == 0) limit = 0.0625;
            if (index == 1) limit = 0.5625;
            if (index == 2) limit = 0.1875;
            if (index == 3) limit = 0.6875;
            if (index == 4) limit = 0.8125;
            if (index == 5) limit = 0.3125;
            if (index == 6) limit = 0.9375;
            if (index == 7) limit = 0.4375;
            if (index == 8) limit = 0.25;
            if (index == 9) limit = 0.75;
            if (index == 10) limit = 0.125;
            if (index == 11) limit = 0.625;
            if (index == 12) limit = 1.0;
            if (index == 13) limit = 0.5;
            if (index == 14) limit = 0.875;
            if (index == 15) limit = 0.375;
        }
        return brightness < limit ? 0.0 : 1.0;
    }

    void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        uv.x *= aspect;

        float intensity = 0.0;

        vec2 signalDir = vec2(cos(uSignalAngle), sin(uSignalAngle));
        vec2 center = vec2(0.5 * aspect, 0.5);
        
        vec2 centeredUv = uv - center;
        float projection = dot(centeredUv, signalDir);

        float phase = projection * 6.0 - uSignalProgress; 
        float mainPulse = pow(max(0.0, sin(phase)), 30.0);
        float echoPulse = pow(max(0.0, sin(phase + 0.5)), 10.0) * 0.4;
        float signalIntensity = mainPulse + echoPulse;

        for (int l = 0; l < LAYER_COUNT - 1; l++) {
            for (int i = 0; i < NEURONS_PER_LAYER; i++) {
                int idx1 = l * NEURONS_PER_LAYER + i;
                vec2 p1 = uNeurons[idx1];
                p1.x *= aspect;

                for (int j = 0; j < NEURONS_PER_LAYER; j++) {
                    int idx2 = (l + 1) * NEURONS_PER_LAYER + j;
                    vec2 p2 = uNeurons[idx2];
                    p2.x *= aspect;

                    float dist = sdSegment(uv, p1, p2);
                    
                    float baseGlow = 0.00005 / (dist * dist + 0.0005);
                    float activeSignal = baseGlow * signalIntensity * 3.0;
                    
                    intensity += baseGlow + activeSignal;
                }
            }
        }

        for (int i = 0; i < ${TOTAL_NEURONS}; i++) {
            vec2 pos = uNeurons[i];
            pos.x *= aspect;
            float dist = distance(uv, pos);
            
            vec2 centeredPos = pos - center;
            float neuronProj = dot(centeredPos, signalDir);
            float neuronPhase = neuronProj * 6.0 - uSignalProgress;
            
            float neuronFlash = pow(max(0.0, sin(neuronPhase)), 30.0) + pow(max(0.0, sin(neuronPhase + 0.5)), 10.0) * 0.4;
            
            float neuronGlow = (0.0002 + neuronFlash * 0.001) / (dist * dist + 0.00005);
            intensity += neuronGlow;
        }

        float vignette = 1.0 - length(vUv - 0.5) * 0.8;
        intensity *= vignette;

        float grain = random(vUv * uTime) * 0.15;
        float finalBrightness = smoothstep(0.1, 0.8, intensity);
        finalBrightness += grain * 0.2;
        
        float dithered = dither4x4(gl_FragCoord.xy, finalBrightness);
        vec3 finalColor = mix(uBgColor, uColor, dithered);
        finalColor += (random(vUv + uTime) - 0.5) * 0.05;

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

const NeuralPulseScene = () => {
    const { theme } = useTheme();
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    const { viewport, pointer } = useThree();

    const signalProgressRef = useRef(0);
    const smoothDirectionRef = useRef(new THREE.Vector2(1, 0.1));

    const neuronsData = useMemo(() => {
        const arr = [];
        for (let l = 0; l < LAYER_COUNT; l++) {
            for (let i = 0; i < NEURONS_PER_LAYER; i++) {
                const baseX = 0.2 + (l / (LAYER_COUNT - 1)) * 0.6;
                const baseY = 0.15 + (i / (NEURONS_PER_LAYER - 1)) * 0.7;

                arr.push({
                    baseX, baseY, x: baseX, y: baseY,
                    offset: Math.random() * 100,
                    speed: 0.3 + Math.random() * 0.4,
                    ampX: 0.1 + Math.random() * 0.1,
                    ampY: 0.1 + Math.random() * 0.15
                });
            }
        }
        return arr;
    }, []);

    const neuronPositionsUniform = useMemo(() => {
        return new Array(TOTAL_NEURONS).fill(0).map(() => new THREE.Vector2());
    }, []);

    const uniforms = useMemo(() => ({
        uNeurons: { value: neuronPositionsUniform },
        uColor: { value: new THREE.Color('#3b82f6') },
        uBgColor: { value: new THREE.Color('#f3f4f6') },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSignalProgress: { value: 0 },
        uSignalAngle: { value: 0 }
    }), [neuronPositionsUniform]);

    useFrame((state, delta) => {
        if (!materialRef.current) return;

        const time = state.clock.getElapsedTime();
        signalProgressRef.current += delta * SIGNAL_SPEED;

        const aspect = viewport.width / viewport.height;
        const mouseX = (pointer.x + 1) / 2;
        const mouseY = (pointer.y + 1) / 2;

        let centroidX = 0;
        let centroidY = 0;

        neuronsData.forEach((neuron, i) => {
            const noiseX = Math.sin(time * neuron.speed + neuron.offset) * neuron.ampX;
            const noiseY = Math.cos(time * neuron.speed * 0.8 + neuron.offset) * neuron.ampY;

            let targetX = neuron.baseX + noiseX;
            let targetY = neuron.baseY + noiseY;

            const dx = (targetX - mouseX) * aspect;
            const dy = targetY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.25) {
                const force = (0.25 - dist) * 0.6;
                targetX += (dx / dist) * force;
                targetY += (dy / dist) * force;
            }

            neuron.x += (targetX - neuron.x) * 0.05;
            neuron.y += (targetY - neuron.y) * 0.05;

            centroidX += neuron.x;
            centroidY += neuron.y;

            neuronPositionsUniform[i].set(neuron.x, neuron.y);
        });

        const avgX = centroidX / TOTAL_NEURONS;
        const avgY = centroidY / TOTAL_NEURONS;

        const targetDirX = avgX - 0.5;
        const targetDirY = avgY - 0.5;

        smoothDirectionRef.current.x += (targetDirX - smoothDirectionRef.current.x) * ROTATION_SMOOTHING;
        smoothDirectionRef.current.y += (targetDirY - smoothDirectionRef.current.y) * ROTATION_SMOOTHING;

        const signalAngle = Math.atan2(
            smoothDirectionRef.current.y,
            smoothDirectionRef.current.x + 0.0001
        );

        materialRef.current.uniforms.uTime.value = time;
        materialRef.current.uniforms.uSignalProgress.value = signalProgressRef.current;
        materialRef.current.uniforms.uResolution.value.set(viewport.width, viewport.height);
        materialRef.current.uniforms.uSignalAngle.value = signalAngle;

        const targetColor = theme === "dark" ? new THREE.Color('#6366f1') : new THREE.Color('#2563eb');
        const targetBg = theme === "dark" ? new THREE.Color('#0f172a') : new THREE.Color('#e2e8f0');

        materialRef.current.uniforms.uColor.value.lerp(targetColor, 0.05);
        materialRef.current.uniforms.uBgColor.value.lerp(targetBg, 0.05);
    });

    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

interface NeuralBackgroundProps {
    quality: number;
}

export const NeuralBackground = ({ quality }: NeuralBackgroundProps) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" style={{ imageRendering: 'pixelated' }}>
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={quality} 
                gl={{ alpha: false, antialias: false }}
                eventSource={document.body}
            >
                <NeuralPulseScene />
            </Canvas>
        </div>
    );
};