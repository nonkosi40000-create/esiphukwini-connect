import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Camera, 
  PartyPopper, 
  GraduationCap, 
  Users, 
  Trophy, 
  Building,
  X
} from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const categories = [
  { id: "all", name: "All", icon: Camera },
  { id: "activities", name: "School Activities", icon: Users },
  { id: "funday", name: "Fun Day", icon: PartyPopper },
  { id: "graduation", name: "Graduation", icon: GraduationCap },
  { id: "assembly", name: "Assembly", icon: Users },
  { id: "achievements", name: "Achievements", icon: Trophy },
  { id: "premises", name: "Our Premises", icon: Building },
];

// Placeholder gallery items - in production these would come from a database
const galleryItems = [
  {
    id: 1,
    category: "activities",
    title: "Sports Day 2024",
    description: "Students participating in various athletic events",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    category: "funday",
    title: "Annual Fun Day",
    description: "Games, food, and entertainment for the whole family",
    image: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    category: "graduation",
    title: "Grade 7 Graduation 2024",
    description: "Celebrating our graduates' achievements",
    image: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    category: "assembly",
    title: "Morning Assembly",
    description: "Students gathered for the daily morning assembly",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    category: "achievements",
    title: "District Athletics Champions",
    description: "Our learners winning gold at district athletics",
    image: "https://images.unsplash.com/photo-1461896836934- voices-and-ebooks-on-a-wooden-table?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    category: "premises",
    title: "Main School Building",
    description: "Our beautiful school entrance and main building",
    image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    category: "activities",
    title: "Netball Practice",
    description: "Our netball team during training session",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop",
  },
  {
    id: 8,
    category: "activities",
    title: "Soccer Tournament",
    description: "Inter-school soccer competition",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
  },
  {
    id: 9,
    category: "achievements",
    title: "Spelling Bee Winners",
    description: "Our champions at the regional spelling bee",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
  },
  {
    id: 10,
    category: "premises",
    title: "School Playground",
    description: "Where our learners play and have fun",
    image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=600&h=400&fit=crop",
  },
  {
    id: 11,
    category: "funday",
    title: "Cultural Day Celebration",
    description: "Celebrating our diverse heritage",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop",
  },
  {
    id: 12,
    category: "assembly",
    title: "Prize Giving Ceremony",
    description: "Recognizing academic excellence",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
  },
  {
    id: 13,
    category: "activities",
    title: "Choir Performance",
    description: "Our school choir at the annual concert",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&h=400&fit=crop",
  },
  {
    id: 14,
    category: "achievements",
    title: "Cricket Team Trophy",
    description: "Winning the inter-district cricket tournament",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop",
  },
  {
    id: 15,
    category: "premises",
    title: "School Library",
    description: "Our well-stocked library for learners",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop",
  },
  {
    id: 16,
    category: "graduation",
    title: "Graduation Ceremony",
    description: "Parents and learners at the graduation",
    image: "https://images.unsplash.com/photo-1564585222527-c2777a5bc6cb?w=600&h=400&fit=crop",
  },
  {
    id: 17,
    category: "activities",
    title: "Athletics Day",
    description: "Track and field events",
    image: "https://images.unsplash.com/photo-1461896836934-ebooks-on-a-wooden-table?w=600&h=400&fit=crop",
  },
  {
    id: 18,
    category: "premises",
    title: "Computer Lab",
    description: "Modern computer facilities for digital learning",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop",
  },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = selectedCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${patternBg})`, backgroundSize: "cover" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              School <span className="text-gold">Gallery</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Explore moments captured at Esiphukwini Junior Primary School - from 
              exciting events to everyday achievements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background sticky top-20 z-40 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-soft">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display text-lg font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop";
              }}
            />
            <div className="mt-4 text-center">
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-white/80">
                {selectedImage.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
};

export default Gallery;
