import { useParams, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import { getBlogPostById } from "../data/blogs";
import { useEffect } from "react";

export default function BlogPost() {
  const params = useParams<{ id: string }>();
  const post = params?.id ? getBlogPostById(params.id) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [params?.id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-heading font-bold mb-4">
            Blog post not found
          </h1>
          <p className="text-muted-foreground mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/blogs">Back to Blogs</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <article className="pb-20">
        {/* Hero image */}
        <div className="w-full aspect-[21/9] max-h-[420px] overflow-hidden bg-muted">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/blogs" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Link>
            </Button>

            <div className="rounded-xl border border-border bg-card shadow-sm p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">
                {post.title}
              </h1>

              <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 text-muted-foreground prose-headings:text-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
