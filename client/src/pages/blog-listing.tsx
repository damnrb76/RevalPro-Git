import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function BlogListing() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Recently";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-10 w-10 text-revalpro-blue" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-revalpro-blue via-revalpro-purple to-revalpro-fuchsia bg-clip-text text-transparent">
                RevalPro Blog
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tips, guides, and insights to help UK nurses manage their NMC revalidation with confidence
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-revalpro-blue/50">
                    {post.featuredImage && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-revalpro-blue/10 text-revalpro-blue hover:bg-revalpro-blue/20">
                          {post.category}
                        </Badge>
                        {post.tags && post.tags.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {post.tags[0]}
                          </Badge>
                        )}
                      </div>

                      <h2 className="text-xl font-bold group-hover:text-revalpro-blue transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(post.publishedAt || post.created)}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-revalpro-blue group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">
                Check back soon for helpful tips and guides on nursing revalidation!
              </p>
            </Card>
          )}

          <div className="mt-12 text-center">
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
