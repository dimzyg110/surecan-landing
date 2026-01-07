import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Download, Mail, QrCode, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function MarketingDashboard() {
  const [, setLocation] = useLocation();
  const [leads, setLeads] = useState<any[]>([]);
  const [qrCodes, setQRCodes] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // QR Code generation form
  const [qrForm, setQRForm] = useState({
    pharmacyName: "",
    pharmacyEmail: "",
    pharmacyPhone: "",
    pharmacyAddress: "",
  });

  useEffect(() => {
    fetchLeads();
    fetchQRCodes();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQRCodes = async () => {
    try {
      const response = await fetch("/api/qrcodes");
      const data = await response.json();
      if (data.success) {
        setQRCodes(data.qrCodes);
      }
    } catch (error) {
      console.error("Failed to fetch QR codes:", error);
    }
  };

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrForm),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("QR code generated!");
        setQRForm({
          pharmacyName: "",
          pharmacyEmail: "",
          pharmacyPhone: "",
          pharmacyAddress: "",
        });
        fetchQRCodes();
      } else {
        toast.error(data.message || "Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    }
  };

  const handleExportToKlaviyo = async () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to export");
      return;
    }

    try {
      const response = await fetch("/api/leads/webhook/klaviyo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedLeads }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Download as JSON file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `klaviyo-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success(`Exported ${data.data.length} leads for Klaviyo`);
      } else {
        toast.error(data.message || "Failed to export leads");
      }
    } catch (error) {
      console.error("Error exporting leads:", error);
      toast.error("Failed to export leads");
    }
  };

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const getProfessionBadge = (profession: string) => {
    const colors: Record<string, string> = {
      gp: "bg-blue-100 text-blue-800",
      pharmacist: "bg-green-100 text-green-800",
      allied_health: "bg-purple-100 text-purple-800",
    };
    return colors[profession] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-[#0A2540]/10">
        <div className="container flex items-center justify-between h-16 lg:h-20">
          <button
            onClick={() => setLocation("/dashboard")}
            className="flex items-center gap-2 text-[#0A2540] hover:text-[#0D9488] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>S</span>
            </div>
            <span className="text-xl font-bold text-[#0A2540]" style={{ fontFamily: 'Space Grotesk' }}>
              Surecan Marketing
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            Marketing Automation
          </h1>
          <p className="text-[#0A2540]/70">
            Manage leads, campaigns, and QR code tracking
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#0A2540]/70">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0D9488]" />
                <span className="text-3xl font-bold text-[#0A2540]">{leads.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#0A2540]/70">High Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0D9488]" />
                <span className="text-3xl font-bold text-[#0A2540]">
                  {leads.filter(l => (l.engagementScore || 0) >= 20).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#0A2540]/70">QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#0D9488]" />
                <span className="text-3xl font-bold text-[#0A2540]">{qrCodes.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#0A2540]/70">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#0D9488]" />
                <span className="text-3xl font-bold text-[#0A2540]">
                  {qrCodes.reduce((sum, qr) => sum + (qr.scans || 0), 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lead Management</CardTitle>
                    <CardDescription>
                      View and export leads with engagement scores
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleExportToKlaviyo}
                      disabled={selectedLeads.length === 0}
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export to Klaviyo ({selectedLeads.length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-8 text-[#0A2540]/70">Loading leads...</p>
                ) : leads.length === 0 ? (
                  <p className="text-center py-8 text-[#0A2540]/70">No leads yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedLeads.length === leads.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeads(leads.map(l => l.id));
                              } else {
                                setSelectedLeads([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Profession</TableHead>
                        <TableHead>Practice</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedLeads.includes(lead.id)}
                              onChange={() => toggleLeadSelection(lead.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{lead.name || "—"}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>
                            <Badge className={getProfessionBadge(lead.profession)}>
                              {lead.profession || "other"}
                            </Badge>
                          </TableCell>
                          <TableCell>{lead.practiceName || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.engagementScore || 0} pts</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-[#0A2540]/70">
                            {lead.source || "website"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qrcodes" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* QR Code Generator */}
              <Card>
                <CardHeader>
                  <CardTitle>Generate QR Code</CardTitle>
                  <CardDescription>
                    Create unique QR codes for pharmacy partners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateQR} className="space-y-4">
                    <div>
                      <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
                      <Input
                        id="pharmacyName"
                        value={qrForm.pharmacyName}
                        onChange={(e) => setQRForm({ ...qrForm, pharmacyName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="pharmacyEmail">Email</Label>
                      <Input
                        id="pharmacyEmail"
                        type="email"
                        value={qrForm.pharmacyEmail}
                        onChange={(e) => setQRForm({ ...qrForm, pharmacyEmail: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pharmacyPhone">Phone</Label>
                      <Input
                        id="pharmacyPhone"
                        value={qrForm.pharmacyPhone}
                        onChange={(e) => setQRForm({ ...qrForm, pharmacyPhone: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="pharmacyAddress">Address</Label>
                      <Input
                        id="pharmacyAddress"
                        value={qrForm.pharmacyAddress}
                        onChange={(e) => setQRForm({ ...qrForm, pharmacyAddress: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* QR Code List */}
              <Card>
                <CardHeader>
                  <CardTitle>Active QR Codes</CardTitle>
                  <CardDescription>
                    Track pharmacy QR code performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {qrCodes.length === 0 ? (
                    <p className="text-center py-8 text-[#0A2540]/70">No QR codes generated yet</p>
                  ) : (
                    <div className="space-y-4">
                      {qrCodes.map((qr) => (
                        <div
                          key={qr.id}
                          className="p-4 border border-[#0A2540]/10 rounded-lg hover:border-[#0D9488]/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-[#0A2540]">{qr.pharmacyName}</h4>
                              <p className="text-sm text-[#0A2540]/70">{qr.code}</p>
                            </div>
                            <Badge variant="outline">{qr.scans || 0} scans</Badge>
                          </div>
                          {qr.pharmacyAddress && (
                            <p className="text-sm text-[#0A2540]/70 mb-2">{qr.pharmacyAddress}</p>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const baseUrl = window.location.origin;
                                const url = `${baseUrl}/referral?qr=${qr.code}`;
                                navigator.clipboard.writeText(url);
                                toast.success("URL copied to clipboard");
                              }}
                            >
                              Copy URL
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
