import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface BetaApplication {
  id: number;
  name: string;
  email: string;
  nmcPin: string;
  nursingSpecialty: string;
  workLocation: string;
  experience: string;
  currentChallenges: string;
  expectations: string;
  testingAvailability: string;
  agreeToTerms: boolean;
  allowContact: boolean;
  submittedAt: string;
}

export default function SimpleBetaView() {
  const [applications, setApplications] = useState<BetaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/beta-applications')
      .then(response => response.json())
      .then(data => {
        setApplications(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Loading Beta Applications...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h1>Error: {error}</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        Beta Applications ({applications.length} total)
      </h1>
      
      {applications.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>NMC PIN</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Specialty</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Experience</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{app.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <a href={`mailto:${app.email}`} style={{ color: '#2563eb' }}>
                    {app.email}
                  </a>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{app.nmcPin}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{app.nursingSpecialty}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{app.experience}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {new Date(app.submittedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No applications yet</h3>
          <p>Beta applications will appear here when submitted.</p>
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f1f5f9', borderRadius: '5px' }}>
        <strong>Quick Links:</strong>
        <br />
        <a href="/beta-signup" style={{ color: '#2563eb', marginRight: '15px' }}>Beta Signup Form</a>
        <a href="/test-beta" style={{ color: '#2563eb' }}>Test Page</a>
      </div>
    </div>
  );
}