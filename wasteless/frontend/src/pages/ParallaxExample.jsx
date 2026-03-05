import ParallaxImage, { ParallaxSection, Parallax3DCard } from '../components/ParallaxImage';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Heart } from 'lucide-react';

/**
 * EXAMPLE: How to use Parallax with your own images
 * 
 * This is a template showing different parallax effects.
 * Replace the image URLs with your own images!
 */

export default function ParallaxExample() {
    return (
        <div className="min-h-screen">
            {/* Example 1: Simple Parallax Image */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Simple Parallax Image
                    </h2>

                    <ParallaxImage
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200"
                        alt="Fresh vegetables"
                        speed={0.5}
                        direction="up"
                        className="h-96 rounded-2xl shadow-2xl"
                        overlay={true}
                        overlayOpacity={0.3}
                    />
                </div>
            </section>

            {/* Example 2: Side-by-side with Content */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ParallaxImage
                            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800"
                            alt="Sustainable food"
                            speed={0.4}
                            className="h-[500px] rounded-2xl shadow-xl"
                            overlay={true}
                        />

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-4">
                                <Leaf size={16} />
                                <span className="text-sm font-medium">Eco-Friendly</span>
                            </div>
                            <h2 className="text-4xl font-bold mb-6">
                                Sustainable Food Choices
                            </h2>
                            <p className="text-xl text-gray-600 mb-6">
                                Make a difference with every meal. Our platform helps you reduce waste
                                and support local communities.
                            </p>
                            <button className="btn btn-primary">Learn More</button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Example 3: 3D Tilt Cards */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        3D Hover Cards
                        <span className="block text-lg text-gray-600 mt-2">
                            Hover over these cards!
                        </span>
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <Parallax3DCard key={i} className="card">
                                <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg mb-4 flex items-center justify-center">
                                    <Heart className="text-white" size={64} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Feature {i}</h3>
                                <p className="text-gray-600">
                                    This card tilts in 3D based on your mouse position!
                                </p>
                            </Parallax3DCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example 4: Multi-layer Parallax */}
            <section className="relative h-screen overflow-hidden">
                {/* Background layer - slowest */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-secondary-900">
                    <ParallaxSection speed={0.2} className="h-full">
                        <div className="h-full bg-grid-pattern opacity-10"></div>
                    </ParallaxSection>
                </div>

                {/* Middle layer - medium speed */}
                <ParallaxSection speed={0.4} className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-center text-white z-10"
                    >
                        <Sparkles className="w-16 h-16 mx-auto mb-6" />
                        <h2 className="text-6xl font-bold mb-4">
                            Multi-Layer Parallax
                        </h2>
                        <p className="text-2xl opacity-90">
                            Different layers moving at different speeds
                        </p>
                    </motion.div>
                </ParallaxSection>

                {/* Foreground layer - fastest */}
                <ParallaxSection speed={0.6} className="absolute bottom-0 left-0 right-0">
                    <div className="h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
                </ParallaxSection>
            </section>

            {/* Example 5: Alternating Layout */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 space-y-32">
                    {/* Left image */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ParallaxImage
                            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800"
                            alt="Healthy food"
                            speed={0.3}
                            className="h-96 rounded-2xl shadow-xl"
                        />
                        <div>
                            <h3 className="text-3xl font-bold mb-4">Fresh & Healthy</h3>
                            <p className="text-gray-600">
                                Discover fresh, locally-sourced ingredients at discounted prices.
                            </p>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="md:order-2">
                            <ParallaxImage
                                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800"
                                alt="Delicious meals"
                                speed={0.3}
                                direction="down"
                                className="h-96 rounded-2xl shadow-xl"
                            />
                        </div>
                        <div className="md:order-1">
                            <h3 className="text-3xl font-bold mb-4">Save Money</h3>
                            <p className="text-gray-600">
                                Get premium meals at up to 70% off from local restaurants.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Instructions */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="card">
                        <h2 className="text-3xl font-bold mb-6">How to Use Your Own Images</h2>

                        <div className="space-y-4 text-gray-600">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-bold text-blue-900 mb-2">Step 1: Add Images</h3>
                                <p>Place your images in <code className="bg-blue-100 px-2 py-1 rounded">public/images/</code></p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-bold text-green-900 mb-2">Step 2: Import Component</h3>
                                <code className="block bg-green-100 p-3 rounded mt-2">
                                    import ParallaxImage from '../components/ParallaxImage';
                                </code>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-bold text-purple-900 mb-2">Step 3: Use It!</h3>
                                <code className="block bg-purple-100 p-3 rounded mt-2 text-sm">
                                    {`<ParallaxImage 
  src="/images/your-image.jpg"
  speed={0.5}
  className="h-96 rounded-xl"
/>`}
                                </code>
                            </div>
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                            <h3 className="font-bold text-lg mb-3">💡 Pro Tips:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>• Use <strong>speed 0.3-0.5</strong> for subtle, professional parallax</li>
                                <li>• Add <strong>overlay={'{true}'}</strong> for better text readability</li>
                                <li>• Layer multiple images with different speeds for depth</li>
                                <li>• Optimize images (WebP format, compressed) for performance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
