import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import type { BlogPost } from "@shared/schema";
import { formatDistanceToNow, format } from "date-fns";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMMM d, yyyy");
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-96 w-full mb-8" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 text-center">
              <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/blog">
                <Button variant="default" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2 mb-8" data-testid="button-back-to-blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Button>
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-revalpro-blue/10 text-revalpro-blue hover:bg-revalpro-blue/20">
                  {post.category}
                </Badge>
                {post.tags && post.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-revalpro-blue via-revalpro-purple to-revalpro-fuchsia bg-clip-text text-transparent">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{post.author}</span>
                  {post.authorRole && <span className="text-xs">• {post.authorRole}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || post.created)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{getReadingTime(post.content)}</span>
                </div>
              </div>

              {post.featuredImage && (
                <div className="rounded-lg overflow-hidden mb-8 shadow-xl">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}
            </header>

            <Card className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-revalpro-blue prose-a:text-revalpro-purple prose-strong:text-revalpro-fuchsia">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </Card>

            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center justify-between">
                <Link href="/blog">
                  <Button variant="outline" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    More Articles
                  </Button>
                </Link>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
