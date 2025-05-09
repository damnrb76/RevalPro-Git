import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, AreaChart, Area,
  RadialBarChart, RadialBar
} from "recharts";
import { formatDateFull } from "@/lib/date-utils";
import type { UserProfile } from "@shared/schema";

type DashboardVisualizationsProps = {
  userProfile: UserProfile | null;
  practiceHours: number;
  cpdHours: number;
  participatoryHours: number;
  feedbackCount: number;
  reflectionsCount: number;
  reflectiveDiscussionCompleted: boolean;
  healthDeclarationCompleted: boolean;
  confirmationCompleted: boolean;
};

const COLORS = [
  "#4c75bf", // revalpro-blue
  "#36b37e", // revalpro-green
  "#00b8d4", // revalpro-teal
  "#ff8f00", // revalpro-orange
  "#9c64a6", // revalpro-purple
  "#3b5cb9", // revalpro-indigo
  "#ec407a", // revalpro-pink
  "#ef5350", // revalpro-red
];

export default function DashboardVisualizations({
  userProfile,
  practiceHours,
  cpdHours,
  participatoryHours,
  feedbackCount,
  reflectionsCount,
  reflectiveDiscussionCompleted,
  healthDeclarationCompleted,
  confirmationCompleted,
}: DashboardVisualizationsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate percentages
  const practiceHoursPercentage = Math.min(100, (practiceHours / 450) * 100);
  const cpdPercentage = Math.min(100, (cpdHours / 35) * 100);
  const participatoryPercentage = Math.min(100, (participatoryHours / 20) * 100);
  const feedbackPercentage = Math.min(100, (feedbackCount / 5) * 100);
  const reflectionPercentage = Math.min(100, (reflectionsCount / 5) * 100);
  const reflectiveDiscussionPercentage = reflectiveDiscussionCompleted ? 100 : 0;
  const healthDeclarationPercentage = healthDeclarationCompleted ? 100 : 0;
  const confirmationPercentage = confirmationCompleted ? 100 : 0;

  // Pie chart data for overall progress
  const overallProgressData = [
    { name: "Practice Hours", value: practiceHoursPercentage },
    { name: "CPD Hours", value: cpdPercentage },
    { name: "Participatory CPD", value: participatoryPercentage },
    { name: "Feedback", value: feedbackPercentage },
    { name: "Reflective Accounts", value: reflectionPercentage },
    { name: "Reflective Discussion", value: reflectiveDiscussionPercentage },
    { name: "Health Declaration", value: healthDeclarationPercentage },
    { name: "Confirmation", value: confirmationPercentage },
  ];

  // Data for practice hours line chart
  // This would ideally come from actual user data
  // Here we're creating a mock progression based on the total hours
  const practiceHoursData = [
    { month: "Jan", hours: Math.min(65, practiceHours) },
    { month: "Feb", hours: Math.min(120, practiceHours) },
    { month: "Mar", hours: Math.min(180, practiceHours) },
    { month: "Apr", hours: Math.min(240, practiceHours) },
    { month: "May", hours: Math.min(310, practiceHours) },
    { month: "Jun", hours: Math.min(370, practiceHours) },
    { month: "Jul", hours: Math.min(430, practiceHours) },
    { month: "Aug", hours: Math.min(450, practiceHours) },
    { month: "Sep", hours: practiceHours },
  ].filter((item, index) => {
    // Only include data points up to the current progress
    const maxPossible = (index + 1) * 60; // roughly 60 hours per month
    return maxPossible <= practiceHours || index === 0;
  });

  // Data for CPD progress bar chart
  const cpdProgressData = [
    { name: "CPD Total", required: 35, completed: cpdHours },
    { name: "Participatory", required: 20, completed: participatoryHours },
  ];

  // Data for feedback by type - this would come from actual user data
  // Here we're creating a sample distribution
  const feedbackTypeData = [
    { name: "Patients", value: Math.ceil(feedbackCount * 0.4) },
    { name: "Colleagues", value: Math.ceil(feedbackCount * 0.3) },
    { name: "Managers", value: Math.floor(feedbackCount * 0.2) },
    { name: "Others", value: Math.max(0, feedbackCount - Math.ceil(feedbackCount * 0.4) - Math.ceil(feedbackCount * 0.3) - Math.floor(feedbackCount * 0.2)) },
  ].filter(item => item.value > 0);

  // Radial bar chart data for requirement completion
  const requirementsData = [
    { name: "Practice Hours", value: practiceHoursPercentage, fill: COLORS[0] },
    { name: "CPD Hours", value: cpdPercentage, fill: COLORS[1] },
    { name: "Participatory CPD", value: participatoryPercentage, fill: COLORS[2] },
    { name: "Feedback", value: feedbackPercentage, fill: COLORS[3] },
    { name: "Reflections", value: reflectionPercentage, fill: COLORS[4] },
    { name: "Discussion", value: reflectiveDiscussionPercentage, fill: COLORS[5] },
    { name: "Health Declaration", value: healthDeclarationPercentage, fill: COLORS[6] },
    { name: "Confirmation", value: confirmationPercentage, fill: COLORS[7] },
  ];
  
  // Timeline data - calculate based on revalidation expiry date
  type TimelineDataItem = {
    name: string;
    percentComplete: number;
    daysRemaining: number;
  };
  
  let timelineData: TimelineDataItem[] = [];
  if (userProfile && userProfile.expiryDate) {
    const expiryDate = new Date(userProfile.expiryDate);
    const threeYearsAgo = new Date(expiryDate);
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    
    const now = new Date();
    const totalDays = (expiryDate.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24);
    const daysElapsed = (now.getTime() - threeYearsAgo.getTime()) / (1000 * 60 * 60 * 24);
    const percentComplete = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
    
    timelineData = [
      { name: "Timeline", percentComplete, daysRemaining: Math.max(0, (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) },
    ];
  }

  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Revalidation Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="hours">Practice Hours</TabsTrigger>
              <TabsTrigger value="cpd">CPD Progress</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">Overall Requirements Progress</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="20%" 
                        outerRadius="90%" 
                        barSize={20} 
                        data={requirementsData}
                        startAngle={180}
                        endAngle={-180}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={10}
                          label={{ position: 'insideStart', fill: '#fff', fontWeight: 'bold', fontSize: 10 }}
                        />
                        <Legend 
                          iconSize={10} 
                          layout="vertical" 
                          verticalAlign="middle" 
                          wrapperStyle={{ fontSize: '12px', right: 0, top: 0, width: 130 }}
                        />
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">Feedback Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={feedbackTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {feedbackTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} feedback records`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">Requirements Completion</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Practice Hours", completed: practiceHours, required: 450 },
                        { name: "CPD Hours", completed: cpdHours, required: 35 },
                        { name: "Participatory", completed: participatoryHours, required: 20 },
                        { name: "Feedback", completed: feedbackCount, required: 5 },
                        { name: "Reflections", completed: reflectionsCount, required: 5 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, name === 'completed' ? 'Completed' : 'Required']} />
                      <Legend />
                      <Bar name="Completed" dataKey="completed" stackId="a" fill="#36b37e" />
                      <Bar name="Required" dataKey="required" stackId="a" fill="#e0e0e0" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            {/* Practice Hours Tab */}
            <TabsContent value="hours">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">Practice Hours Progression</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={practiceHoursData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} hours`, 'Practice Hours']} />
                      <Legend />
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4c75bf" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4c75bf" stopOpacity={0.2} />
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#4c75bf" 
                        fillOpacity={1} 
                        fill="url(#colorHours)" 
                        name="Practice Hours"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#4c75bf" 
                        strokeWidth={3} 
                        dot={{ r: 5 }} 
                        activeDot={{ r: 8 }}
                        name="Practice Hours"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Target: 450 hours minimum</p>
                  <p>Current progress: {practiceHours} hours ({practiceHoursPercentage.toFixed(0)}%)</p>
                  <p>Hours needed: {Math.max(0, 450 - practiceHours)} more hours required</p>
                </div>
              </div>
            </TabsContent>
            
            {/* CPD Progress Tab */}
            <TabsContent value="cpd">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">CPD Hours Progress</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cpdProgressData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => [`${value} hours`, '']} />
                        <Legend />
                        <Bar name="Completed" dataKey="completed" fill="#36b37e" />
                        <Bar name="Required" dataKey="required" fill="#e0e0e0" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">CPD Completion Status</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Completed", value: cpdHours },
                            { name: "Remaining", value: Math.max(0, 35 - cpdHours) },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#36b37e" />
                          <Cell fill="#e0e0e0" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} hours`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border mt-4">
                <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">CPD Recommendations Based on Progress</h3>
                <div className="text-sm text-gray-600">
                  {cpdHours < 35 ? (
                    <div>
                      <p className="font-medium text-revalpro-dark-blue mb-2">You need {35 - cpdHours} more CPD hours to meet the minimum requirement.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Consider online courses (many are free or low-cost)</li>
                        <li>Attend workplace training sessions</li>
                        <li>Participate in professional webinars</li>
                        <li>Read and reflect on journal articles</li>
                        <li>Engage in professional discussion groups</li>
                      </ul>
                    </div>
                  ) : (
                    <p>Congratulations! You've met your CPD hours requirement. Continue to seek professional development opportunities to enhance your practice.</p>
                  )}
                  
                  {participatoryHours < 20 && (
                    <div className="mt-4">
                      <p className="font-medium text-revalpro-dark-blue mb-2">You need {20 - participatoryHours} more participatory CPD hours.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Attend team meetings or case discussions</li>
                        <li>Participate in clinical supervision</li>
                        <li>Join webinars with Q&A sessions</li>
                        <li>Contribute to quality improvement initiatives</li>
                        <li>Attend conferences or workshops</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Timeline Tab */}
            <TabsContent value="timeline">
              {userProfile && userProfile.expiryDate ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">Revalidation Timeline</h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={timelineData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip formatter={(value: number, name) => [name === 'percentComplete' ? `${value.toFixed(1)}% completed` : `${value.toFixed(0)} days remaining`, '']} />
                          <Bar 
                            dataKey="percentComplete" 
                            fill="#4c75bf" 
                            background={{ fill: '#eee' }}
                            radius={[10, 10, 10, 10]}
                            name="Cycle Completion"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-revalpro-blue/10 p-4 rounded-lg">
                        <h4 className="font-medium text-revalpro-dark-blue mb-2">Revalidation Cycle</h4>
                        <p>
                          <span className="font-medium">Start Date:</span>{" "}
                          {formatDateFull(new Date(new Date(userProfile.expiryDate).getFullYear() - 3, new Date(userProfile.expiryDate).getMonth(), new Date(userProfile.expiryDate).getDate()))}
                        </p>
                        <p>
                          <span className="font-medium">End Date:</span>{" "}
                          {formatDateFull(userProfile.expiryDate)}
                        </p>
                      </div>
                      
                      <div className="bg-revalpro-green/10 p-4 rounded-lg">
                        <h4 className="font-medium text-revalpro-dark-blue mb-2">Current Status</h4>
                        <p>
                          <span className="font-medium">Time Elapsed:</span>{" "}
                          {timelineData[0].percentComplete.toFixed(1)}% of cycle
                        </p>
                        <p>
                          <span className="font-medium">Time Remaining:</span>{" "}
                          {timelineData[0].daysRemaining.toFixed(0)} days
                        </p>
                      </div>
                      
                      <div className="bg-revalpro-orange/10 p-4 rounded-lg">
                        <h4 className="font-medium text-revalpro-dark-blue mb-2">Key Milestones</h4>
                        <p>
                          <span className="font-medium">Application Window:</span>{" "}
                          Opens 60 days before expiry
                        </p>
                        <p>
                          <span className="font-medium">Submission Deadline:</span>{" "}
                          {formatDateFull(userProfile.expiryDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-md font-medium text-revalpro-dark-blue mb-2">Suggested Timeline</h4>
                      <div className="relative">
                        <div className="absolute left-4 h-full w-0.5 bg-revalpro-blue"></div>
                        
                        <div className="relative pl-12 pb-8">
                          <div className="absolute left-2 w-6 h-6 rounded-full bg-revalpro-blue text-white flex items-center justify-center text-sm font-bold">1</div>
                          <h5 className="font-medium">12-36 months before expiry</h5>
                          <p className="text-sm text-gray-600">Start collecting practice hours and CPD activities</p>
                        </div>
                        
                        <div className="relative pl-12 pb-8">
                          <div className="absolute left-2 w-6 h-6 rounded-full bg-revalpro-blue text-white flex items-center justify-center text-sm font-bold">2</div>
                          <h5 className="font-medium">6-12 months before expiry</h5>
                          <p className="text-sm text-gray-600">Complete reflective accounts and gather feedback</p>
                        </div>
                        
                        <div className="relative pl-12 pb-8">
                          <div className="absolute left-2 w-6 h-6 rounded-full bg-revalpro-blue text-white flex items-center justify-center text-sm font-bold">3</div>
                          <h5 className="font-medium">3-6 months before expiry</h5>
                          <p className="text-sm text-gray-600">Arrange reflective discussion with confirmer</p>
                        </div>
                        
                        <div className="relative pl-12 pb-8">
                          <div className="absolute left-2 w-6 h-6 rounded-full bg-revalpro-blue text-white flex items-center justify-center text-sm font-bold">4</div>
                          <h5 className="font-medium">1-3 months before expiry</h5>
                          <p className="text-sm text-gray-600">Complete health declaration and confirmation form</p>
                        </div>
                        
                        <div className="relative pl-12">
                          <div className="absolute left-2 w-6 h-6 rounded-full bg-revalpro-blue text-white flex items-center justify-center text-sm font-bold">5</div>
                          <h5 className="font-medium">60 days before expiry</h5>
                          <p className="text-sm text-gray-600">Submit revalidation application to NMC</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
                  <h3 className="text-lg font-medium mb-4 text-revalpro-dark-blue">Timeline Not Available</h3>
                  <p className="text-gray-600 mb-4">Please set your registration expiry date in your profile settings to view the revalidation timeline.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}