import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, ArrowRight, ArrowLeft, BookOpen } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { blogPosts, getBlogPostById, type BlogPost } from "../data/blogs";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/blogs/${post.id}`}>
        <Card className="cursor-pointer h-full flex flex-col hover:shadow-lg transition-shadow">
          <CardContent className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              {post.category && (
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {post.date}
              </span>
            </div>

            <h3 className="font-heading font-semibold text-lg mb-2">
              {post.title}
            </h3>

            <p className="text-sm text-muted-foreground flex-1">
              {post.sections[0]?.paragraphs[0]}
            </p>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3">
              Read more
              <ArrowRight className="h-4 w-4" />
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function Blogs() {
  const params = useParams<{ id?: string }>();
  const post = params?.id ? getBlogPostById(params.id) : undefined;
  const isDetailView = Boolean(params?.id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [params?.id]);

  if (isDetailView) {
    if (!post) {
      return (
        <div className="min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <Button asChild>
              <Link href="/blogs">Back to Blogs</Link>
            </Button>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-20 max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/blogs" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blogs
            </Link>
          </Button>

          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-heading font-bold">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {post.category && <Badge variant="secondary">{post.category}</Badge>}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              {post.readTime && <span>{post.readTime}</span>}
            </div>
          </div>

          <div className="space-y-10">
            {post.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-2xl font-semibold">{section.heading}</h2>

                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">
                    {p}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <section className="py-20 bg-secondary/20 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="uppercase text-sm font-medium">Blog</span>
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4">
            Insights & Updates
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practical guidance on real estate and property decisions.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}