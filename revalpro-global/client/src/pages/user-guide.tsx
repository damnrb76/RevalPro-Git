import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  PlayCircle, 
  ExternalLink, 
  Download,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Lightbulb,
  Star,
  Zap
} from "lucide-react";

export default function UserGuidePage() {
  const [activeGuide, setActiveGuide] = useState("quick-start");

  const guideCards = [
    {
      id: "quick-start",
      title: "Quick Start Guide",
      description: "Get started with RevalPro in 5 minutes",
      icon: <Zap className="w-6 h-6" />,
      badge: "Essential",
      badgeColor: "bg-green-500",
      content: `
        <h3>🚀 Quick Start Guide</h3>
        <p>Get started with RevalPro in just a few minutes!</p>
        <ol>
          <li>Visit the application in your browser</li>
          <li>Click <strong>"Register"</strong> to create your account</li>
          <li>Complete the profile setup with your NMC details</li>
          <li>Start tracking your revalidation progress</li>
        </ol>
        
        <h3>Essential First Steps</h3>
        <ul>
          <li><strong>Dashboard:</strong> View progress indicators</li>
          <li><strong>Practice Hours:</strong> Try manual entry and weekly calculator</li>
          <li><strong>AI Assistant:</strong> Ask for professional guidance</li>
          <li><strong>Export:</strong> Generate your first portfolio summary</li>
        </ul>
      `
    },
    {
      id: "complete-guide",
      title: "Complete User Manual",
      description: "Comprehensive documentation covering all features",
      icon: <BookOpen className="w-6 h-6" />,
      badge: "Comprehensive",
      badgeColor: "bg-blue-500",
      content: `
        <h3>📖 Complete Documentation</h3>
        <p>The complete user guide covers every aspect of RevalPro:</p>
        <ul>
          <li><strong>Getting Started:</strong> Account setup and navigation</li>
          <li><strong>Core Features:</strong> Practice hours, CPD, reflections, feedback</li>
          <li><strong>Analytics:</strong> Reports, exports, and audit system</li>
          <li><strong>AI Assistant:</strong> Professional guidance and support</li>
          <li><strong>Settings:</strong> Profile management and preferences</li>
          <li><strong>Troubleshooting:</strong> Common issues and solutions</li>
        </ul>
        
        <p>Available as downloadable PDF and markdown formats for offline reference.</p>
      `
    },
    {
      id: "nmc-requirements",
      title: "NMC Requirements Guide",
      description: "Understanding revalidation requirements and compliance",
      icon: <CheckCircle className="w-6 h-6" />,
      badge: "NMC Official",
      badgeColor: "bg-purple-500",
      content: `
        <h3>📋 NMC Revalidation Requirements</h3>
        <p>Essential requirements for your 3-year revalidation cycle:</p>
        
        <div class="space-y-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h4><strong>450+ Practice Hours</strong></h4>
            <p>Documented nursing practice over 3 years with variety of settings and scopes.</p>
          </div>
          
          <div class="border-l-4 border-green-500 pl-4">
            <h4><strong>35+ CPD Hours</strong></h4>
            <p>Continuing professional development: 20+ participatory, max 15 non-participatory.</p>
          </div>
          
          <div class="border-l-4 border-orange-500 pl-4">
            <h4><strong>5 Reflective Accounts</strong></h4>
            <p>Written reflections following NMC structure, linked to Code standards.</p>
          </div>
          
          <div class="border-l-4 border-purple-500 pl-4">
            <h4><strong>5+ Feedback Pieces</strong></h4>
            <p>Patient, carer, and colleague feedback demonstrating professional practice.</p>
          </div>
        </div>
      `
    },
    {
      id: "video-tutorials",
      title: "Video Tutorials",
      description: "Step-by-step video guides for key features",
      icon: <PlayCircle className="w-6 h-6" />,
      badge: "Coming Soon",
      badgeColor: "bg-gray-500",
      content: `
        <h3>🎥 Video Tutorial Library</h3>
        <p>Comprehensive video tutorials covering all major features:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4>Getting Started Series</h4>
            <ul class="text-sm">
              <li>Creating your account</li>
              <li>Dashboard overview</li>
              <li>Navigation basics</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4>Core Features</h4>
            <ul class="text-sm">
              <li>Practice hours tracking</li>
              <li>CPD management</li>
              <li>Writing reflections</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4>Advanced Features</h4>
            <ul class="text-sm">
              <li>AI assistant usage</li>
              <li>Analytics and reporting</li>
              <li>Export and audit system</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4>Tips & Best Practices</h4>
            <ul class="text-sm">
              <li>Efficient data entry</li>
              <li>Portfolio preparation</li>
              <li>NMC submission process</li>
            </ul>
          </div>
        </div>
        
        <p class="text-gray-600 mt-4"><em>Video tutorials are currently in development and will be available soon.</em></p>
      `
    }
  ];

  const quickTips = [
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      title: "Use AI Assistant",
      description: "Available throughout the app for professional guidance"
    },
    {
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      title: "Regular Updates",
      description: "Enter data monthly for best accuracy and progress tracking"
    },
    {
      icon: <Download className="w-5 h-5 text-green-500" />,
      title: "Export Often",
      description: "Keep regular backups of your revalidation progress"
    },
  ];

  const externalResources = [
    {
      title: "NMC Official Revalidation Guide",
      description: "Complete NMC guidance on revalidation requirements",
      url: "https://www.nmc.org.uk/revalidation/",
      icon: <ExternalLink className="w-4 h-4" />
    },
    {
      title: "NMC Code of Conduct",
      description: "Professional standards for nursing and midwifery",
      url: "https://www.nmc.org.uk/standards/code/",
      icon: <ExternalLink className="w-4 h-4" />
    },
    {
      title: "NMC Online Services",
      description: "Manage your registration and submit revalidation",
      url: "https://www.nmc.org.uk/registration/staying-on-the-register/",
      icon: <ExternalLink className="w-4 h-4" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📚 RevalPro User Guides
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to master RevalPro and achieve successful NMC revalidation
          </p>
        </div>

        <Tabs value={activeGuide} onValueChange={setActiveGuide} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="complete-guide">Complete Guide</TabsTrigger>
            <TabsTrigger value="nmc-requirements">NMC Requirements</TabsTrigger>
            <TabsTrigger value="video-tutorials">Video Tutorials</TabsTrigger>
          </TabsList>

          {/* Guide Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {guideCards.map((guide) => (
                <TabsContent key={guide.id} value={guide.id}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        {guide.icon}
                        <div className="flex-grow">
                          <CardTitle className="flex items-center gap-2">
                            {guide.title}
                            <Badge 
                              className={`text-white ${guide.badgeColor}`}
                            >
                              {guide.badge}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{guide.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose prose-gray max-w-none"
                        dangerouslySetInnerHTML={{ __html: guide.content }}
                      />
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-6 border-t">
                        {guide.id === "complete-guide" && (
                          <>
                            <Button className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download PDF
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              View Markdown
                            </Button>
                          </>
                        )}
                        {guide.id === "nmc-requirements" && (
                          <Button variant="outline" className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            NMC Official Site
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Quick Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {tip.icon}
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* External Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-blue-500" />
                    NMC Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {externalResources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {resource.icon}
                        <div>
                          <h4 className="font-medium text-sm">{resource.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Need More Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    FAQ Section
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}