import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { BlogPost } from "@shared/schema";
import { BlogCategoryEnum } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

// Use the correct categories from schema
const BlogCategories = Object.values(BlogCategoryEnum) as const;

export default function BlogManagement() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: string;
    authorRole: string;
    featuredImage: string;
    category: string;
    tags: string;
    published: boolean;
  }>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    authorRole: "Nurse Educator",
    featuredImage: "",
    category: "Revalidation Tips", // Default to first category
    tags: "",
    published: false,
  });

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        authorRole: post.authorRole || "",
        featuredImage: post.featuredImage || "",
        category: post.category,
        tags: post.tags?.join(", ") || "",
        published: post.published || false,
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "",
        authorRole: "Nurse Educator",
        featuredImage: "",
        category: BlogCategoryEnum.REVALIDATION_GUIDANCE, // Default to first category
        tags: "",
        published: false,
      });
    }
    setIsDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        publishedAt: formData.published ? new Date().toISOString() : null,
      };

      if (editingPost) {
        await apiRequest("PATCH", `/api/admin/blog/${editingPost.id}`, payload);
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/admin/blog", payload);
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
      }

      setIsDialogOpen(false);
      // Invalidate after closing dialog to prevent blocking
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    } catch (error: any) {
      console.error("Blog save error:", error);
      const errorMsg = error?.response?.data?.details?.[0]?.message || 
                       error?.response?.data?.error ||
                       "Failed to save blog post";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await apiRequest("DELETE", `/api/admin/blog/${id}`, {});
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2" data-testid="button-create-post">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    data-testid="input-blog-title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (!editingPost) {
                        setFormData((prev) => ({
                          ...prev,
                          slug: generateSlug(e.target.value),
                        }));
                      }
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    data-testid="input-blog-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    data-testid="input-blog-excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content (HTML supported)</Label>
                  <Textarea
                    id="content"
                    data-testid="input-blog-content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      data-testid="input-blog-author"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="authorRole">Author Role</Label>
                    <Input
                      id="authorRole"
                      data-testid="input-blog-author-role"
                      value={formData.authorRole}
                      onChange={(e) =>
                        setFormData({ ...formData, authorRole: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input
                    id="featuredImage"
                    data-testid="input-blog-featured-image"
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredImage: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger data-testid="select-blog-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BlogCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    data-testid="input-blog-tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="revalidation, nmc, tips"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    data-testid="switch-blog-published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} data-testid="button-save-post">
                  {editingPost ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="p-6" data-testid={`card-blog-post-${post.id}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    {post.published ? (
                      <Badge className="bg-green-500">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(
                        new Date(post.publishedAt || post.created),
                        { addSuffix: true }
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                    data-testid={`button-view-${post.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(post)}
                    data-testid={`button-edit-${post.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    data-testid={`button-delete-${post.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first blog post to get started
          </p>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Card>
      )}
    </div>
  );
}
