import { useState, useEffect, useRef, Suspense } from 'react';
import { ChevronDown, Cpu, MapPin, Database, Github, Linkedin, Mail } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';

export default function LandingPage() {
    const [stats, setStats] = useState({ area: 0, consumption: 0, swarmSize: 0 });
    const [visibleSections, setVisibleSections] = useState([]);
    const sectionRefs = useRef([]);
    
    // Set up intersection observers for all sections
    useEffect(() => {
        const observers = [];
        
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };
        
        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting) {
                    setVisibleSections(prev => [...new Set([...prev, sectionId])]);
                    
                    // Special case for stats animation
                    if (sectionId === 'problem-section') {
                        animateStats();
                    }
                }
            });
        };
        
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observe all sections with refs
        sectionRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });
        
        return () => {
            sectionRefs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);
    
    const animateStats = () => {
        let interval = setInterval(() => {
            setStats(prev => {
                const newArea = Math.min(prev.area + 12, 2400);
                const newConsumption = Math.min(prev.consumption + 0.1, 2);
                const newSwarmSize = Math.min(prev.swarmSize + 10, 80);
                
                if (newArea === 2400 && newConsumption === 2 && newSwarmSize === 80) {
                    clearInterval(interval);
                }
                
                return {
                    area: newArea,
                    consumption: newConsumption,
                    swarmSize: newSwarmSize
                };
            });
        }, 30);
    };
    
    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Helper function to check if section is visible
    const isSectionVisible = (sectionId) => visibleSections.includes(sectionId);
    

    // Locust 3D Model with Texture
    function Locust() {
        const { scene } = useGLTF('/locust.glb');
        const texture = useTexture('/locust-texture.jpeg');
        
        useEffect(() => {
            scene.traverse((node) => {
                if (node.isMesh) {
                    node.material.map = texture;
                }
            });
        }, [scene, texture]);
        
        return <primitive object={scene} scale={1.5} />;
    }
    
    // Animation classes based on visibility
    const getAnimationClass = (sectionId, baseClasses = '') => {
        return `${baseClasses} transition-all duration-700 ease-out ${
            isSectionVisible(sectionId) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
        }`;
    };
    
    // Assign refs to sections
    const setSectionRef = (index) => (el) => {
        sectionRefs.current[index] = el;
    };

    return (
        <div className="font-sans text-gray-800 w-full">
            {/* Hero Section */}
            <section 
    id="hero-section"
    ref={setSectionRef(0)}
    className="min-h-screen flex flex-col justify-center items-center text-center text-white relative px-4 md:px-16"
    style={{
        background: "linear-gradient(rgba(6, 45, 12, 0.85), rgba(6, 45, 12, 0.9)), url('/api/placeholder/1200/800')",
        backgroundSize: "cover",
        backgroundPosition: "center"
    }}
>
    {/* Logo Container */}
    <div className="absolute top-2 left-4 p-6 rounded-full" style={{
        background: "radial-gradient(circle, rgba(210, 180, 140, 1) 0%, rgba(160, 82, 45, 0) 60%)"
    }}>
        <img src="/logo.png" alt="Logo" className="h-22 -mt-[10]" />
    </div>

    <div className={`max-w-screen-lg mx-auto ${getAnimationClass('hero-section')}`}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Athar: Fighting Locust Plagues with Quantum Intelligence</h1>
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto">Detect. Predict. Protect. A novel quantum approach to desert locust monitoring.</p>

        {/* 3D Locust Model Container */}
        <div className="w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden bg-opacity-50">
            <model-viewer 
                src="/locust.glb" 
                alt="A 3D model of a robot"
                auto-rotate 
                camera-controls 
                background-color="#455A64"
            ></model-viewer>
        </div>
    </div>

    <div className="absolute bottom-8 w-full flex justify-center animate-bounce">
        <ChevronDown size={36} />
    </div>
</section>


            {/* Problem Section */}
            <section 
                id="problem-section" 
                ref={setSectionRef(1)}
                className="py-20 px-4 md:px-16" 
                style={{ backgroundColor: "#f6f8e8" }}
            >
                <div className="max-w-screen-lg mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${getAnimationClass('problem-section')}`} style={{ color: "#283618" }}>
                        The Devastating Impact of Locust Swarms
                    </h2>
                    
                    <p className={`text-lg text-center mb-12 max-w-2xl mx-auto ${getAnimationClass('problem-section')}`}>
                        According to the UN Food and Agriculture Organisation (FAO), desert locusts are among the world's most destructive migratory pests. Traditional monitoring methods struggle to predict and control these devastating swarms.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { value: stats.area.toLocaleString(), unit: "sq km", text: "area that can be covered by a single swarm - the size of Luxembourg" },
                            { value: stats.consumption, unit: "million kg", text: "food consumed by a swarm daily - enough to feed 2,500 people" },
                            { value: stats.swarmSize, unit: "million", text: "locusts in an average swarm, with some reaching billions" }
                        ].map((stat, index) => (
                            <div 
                                key={index}
                                className={`p-8 rounded-lg shadow-md hover:shadow-lg transition ${getAnimationClass('problem-section', 'delay-' + (index * 100))}`}
                                style={{ 
                                    backgroundColor: "#fff", 
                                    borderLeft: "4px solid #588157",
                                    transitionDelay: `${index * 100}ms`
                                }}
                            >
                                <h3 className="text-2xl font-bold mb-2" style={{ color: "#3a5a40" }}>
                                    {stat.value} {stat.unit}
                                </h3>
                                <p className="text-gray-600">{stat.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Section */}
<section 
    id="solution-section" 
    ref={setSectionRef(2)}
    className="py-20 px-4 md:px-16" 
    style={{ backgroundColor: "#fff" }}
>
    <div className="max-w-screen-lg mx-auto">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${getAnimationClass('solution-section')}`} style={{ color: "#283618" }}>
            Our Quantum-Powered Approach
        </h2>
        
        <div className="grid grid-cols-1 gap-12">
            <div className="space-y-12">
                {[
                    { 
                        icon: <Cpu style={{ color: "#3a5a40" }} size={28} />,
                        title: "Quantum Soil Sensors",
                        text: "Our specialized sensors detect minute changes in soil composition and humidity that indicate optimal locust breeding conditions."
                    },
                    { 
                        icon: <MapPin style={{ color: "#3a5a40" }} size={28} />,
                        title: "Quantum Communication Network",
                        text: "Our system leverages quantum entanglement for instantaneous data transfer between sensors and ground stations, enabling real-time swarm monitoring across continents."
                    },
                    { 
                        icon: <Database style={{ color: "#3a5a40" }} size={28} />,
                        title: "Quantum Machine Learning",
                        text: "Our custom QML algorithms process complex environmental patterns to generate accurate prediction maps weeks before traditional methods."
                    }
                ].map((item, index) => (
                    <div 
                        key={index}
                        className={`flex items-start ${getAnimationClass('solution-section', 'delay-' + (index * 100))}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <div className="mr-4 p-3 rounded-full" style={{ backgroundColor: "#dde5b6" }}>
                            {item.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: "#3a5a40" }}>{item.title}</h3>
                            <p className="text-gray-600">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
</section>

            {/* GIS Dashboard Preview */}
            <section 
                id="dashboard-section" 
                ref={setSectionRef(3)}
                className="py-20 px-4 md:px-16 text-white" 
                style={{ backgroundColor: "#283618" }}
            >
                <div className={`max-w-screen-lg mx-auto text-center ${getAnimationClass('dashboard-section')}`}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Live Monitoring Dashboard</h2>
                    <p className="text-lg mb-12 max-w-2xl mx-auto">
                        Our GIS dashboard provides real-time locust breeding probability maps and migration predictions
                    </p>
                    
                    <a href="https://teamathardemo.netlify.app/" target="_self" rel="noopener noreferrer">
  <button 
    className={`text-white text-lg font-medium py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300 ${getAnimationClass('dashboard-section', 'delay-200')}`} 
    style={{ 
      backgroundColor: "#588157",
      transitionDelay: "200ms"
    }}
  >
    View GIS Dashboard
  </button>
</a>

                </div>
            </section>

            {/* Tech Stack Section */}
            <section 
                id="tech-section" 
                ref={setSectionRef(4)}
                className="py-20 px-4 md:px-16" 
                style={{ backgroundColor: "#fff" }}
            >
                <div className="max-w-screen-lg mx-auto">
                    <h2 className={`text-3xl md:text-4xl font-bold text-center mb-16 ${getAnimationClass('tech-section')}`} style={{ color: "#283618" }}>
                        Our Innovation Stack
                    </h2>

                    <div className="flex flex-wrap justify-center gap-8 text-center">
                        {[
                            {
                                icon: <Cpu style={{ color: "#3a5a40" }} size={32} />,
                                title: "Quantum Sensors",
                                text: "Next-gen soil composition detection"
                            },
                            {
                                icon: <Database style={{ color: "#3a5a40" }} size={32} />,
                                title: "Quantum ML",
                                text: "Advanced pattern recognition algorithms"
                            },
                            {
                                icon: <MapPin style={{ color: "#3a5a40" }} size={32} />,
                                title: "Interactive Mapping",
                                text: "Real-time locust breeding ground visualization"
                            }
                        ].map((item, index) => (
                            <div 
                                key={index}
                                className={`p-6 hover:scale-105 transition ${getAnimationClass('tech-section', 'delay-' + (index * 100))}`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="p-6 rounded-full inline-flex justify-center mb-4" style={{ backgroundColor: "#dde5b6" }}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: "#3a5a40" }}>{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section 
                id="team-section" 
                ref={setSectionRef(5)}
                className="py-20 px-4 md:px-16" 
                style={{ backgroundColor: "#f6f8e8" }}
            >
                <div className={`max-w-screen-lg mx-auto text-center ${getAnimationClass('team-section')}`}>
                    <h2 className="text-3xl md:text-4xl font-bold mb-16" style={{ color: "#283618" }}>Athar</h2>
                    
                    <p className="text-xl mb-12">Developed by NYUAD Hackathon Team 2</p>
                    
                    <div className={`flex justify-center space-x-4 ${getAnimationClass('team-section', 'delay-100')}`} 
                        style={{ transitionDelay: "100ms" }}
                    >
                        {[
                            { icon: <Github style={{ color: "#3a5a40" }} size={24} />, href: "#" },
                            { icon: <Linkedin style={{ color: "#3a5a40" }} size={24} />, href: "#" },
                            { icon: <Mail style={{ color: "#3a5a40" }} size={24} />, href: "#" }
                        ].map((item, index) => (
                            <a 
                                key={index}
                                href={item.href} 
                                className="p-3 rounded-full hover:bg-green-200 transition" 
                                style={{ 
                                    backgroundColor: "#dde5b6",
                                    transitionDelay: `${index * 100 + 100}ms`
                                }}
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer 
                id="footer-section" 
                ref={setSectionRef(6)}
                className="py-8 px-4 md:px-16 text-white" 
                style={{ backgroundColor: "#283618" }}
            >
                <div className={`max-w-screen-lg mx-auto flex flex-col md:flex-row justify-between items-center ${getAnimationClass('footer-section')}`}>
                    <div className="mb-6 md:mb-0">
                        <p className="font-bold text-xl">Quantum Locust Project</p>
                        <p className="text-sm" style={{ color: "#a3b18a" }}>© 2025 NYUAD Hackathon</p>
                    </div>
                    
                    <div className={`flex space-x-6 ${getAnimationClass('footer-section', 'delay-100')}`} 
                        style={{ transitionDelay: "100ms" }}
                    >
                        {["GitHub", "Contact", "Disclaimer"].map((item, index) => (
                            <a 
                                key={index}
                                href="#" 
                                className="hover:text-white transition" 
                                style={{ 
                                    color: "#a3b18a",
                                    transitionDelay: `${index * 100 + 100}ms`
                                }}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
                <div className={`max-w-screen-lg mx-auto mt-6 pt-6 border-t border-gray-700 text-center text-sm ${getAnimationClass('footer-section', 'delay-200')}`} 
                    style={{ 
                        color: "#a3b18a", 
                        borderColor: "#3a5a40",
                        transitionDelay: "200ms"
                    }}
                >
                    <p>Disclaimer: Demo project with simulated data for educational purposes only</p>
                </div>
            </footer>
        </div>
    );
}