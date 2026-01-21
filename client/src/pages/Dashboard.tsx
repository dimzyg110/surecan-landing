import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Calendar, User, Phone, Mail, FileText } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import type { Referral } from "../../../drizzle/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterReferrerType, setFilterReferrerType] = useState<string>("all");
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await fetch("/api/referrals");
      const data = await response.json();
      if (data.success) {
        setReferrals(data.referrals);
      }
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to load referrals");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/referrals/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Status updated");
        fetchReferrals();
        setSelectedReferral(null);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Network error");
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredReferrals = referrals.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterReferrerType !== "all" && r.referrerType !== filterReferrerType) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  const getReferrerTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      gp: "GP",
      pharmacist: "Pharmacist",
      allied_health: "Allied Health",
    };
    return <Badge variant="outline">{labels[type] || type}</Badge>;
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-teal-900">
      {/* Header */}
      <header className="bg-navy-950/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-display font-bold text-white">
            Referral Dashboard
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Total Referrals</CardDescription>
              <CardTitle className="text-3xl">{referrals.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-orange-600">
                {referrals.filter((r) => r.status === "pending").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Contacted</CardDescription>
              <CardTitle className="text-3xl text-blue-600">
                {referrals.filter((r) => r.status === "contacted").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600">
                {referrals.filter((r) => r.status === "completed").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Referrals</CardTitle>
                <CardDescription>Manage and review patient referrals</CardDescription>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterReferrerType} onValueChange={setFilterReferrerType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Referrer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="gp">GP</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="allied_health">Allied Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No referrals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.patientName}</TableCell>
                        <TableCell>{referral.referrerName}</TableCell>
                        <TableCell>{getReferrerTypeBadge(referral.referrerType)}</TableCell>
                        <TableCell>{getStatusBadge(referral.status)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={referral.urgency === "emergency" ? "destructive" : "outline"}
                          >
                            {referral.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(referral.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReferral(referral)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Detail Dialog */}
      <Dialog open={!!selectedReferral} onOpenChange={() => setSelectedReferral(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Referral Details</DialogTitle>
            <DialogDescription>
              Submitted on {selectedReferral && formatDate(selectedReferral.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReferral && (
            <div className="space-y-6">
              {/* Patient Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedReferral.patientName}</p>
                  </div>
                  {selectedReferral.patientEmail && (
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedReferral.patientEmail}</p>
                    </div>
                  )}
                  {selectedReferral.patientPhone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedReferral.patientPhone}</p>
                    </div>
                  )}
                  {selectedReferral.patientDob && (
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{selectedReferral.patientDob}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Referrer Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Referrer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedReferral.referrerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{getReferrerTypeBadge(selectedReferral.referrerType)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedReferral.referrerEmail}</p>
                  </div>
                  {selectedReferral.referrerPhone && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{selectedReferral.referrerPhone}</p>
                    </div>
                  )}
                  {selectedReferral.referrerPracticeName && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Practice</p>
                      <p className="font-medium">{selectedReferral.referrerPracticeName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Clinical Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Clinical Indication</p>
                    <p className="font-medium">{selectedReferral.clinicalIndication}</p>
                  </div>
                  {selectedReferral.currentMedications && (
                    <div>
                      <p className="text-muted-foreground mb-1">Current Medications</p>
                      <p className="font-medium">{selectedReferral.currentMedications}</p>
                    </div>
                  )}
                  {selectedReferral.relevantHistory && (
                    <div>
                      <p className="text-muted-foreground mb-1">Relevant History</p>
                      <p className="font-medium">{selectedReferral.relevantHistory}</p>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div>
                      <p className="text-muted-foreground mb-1">Urgency</p>
                      <Badge variant={selectedReferral.urgency === "emergency" ? "destructive" : "outline"}>
                        {selectedReferral.urgency}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      {getStatusBadge(selectedReferral.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="pt-4 border-t">
                <Label className="mb-2 block">Update Status</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating || selectedReferral.status === "pending"}
                    onClick={() => updateStatus(selectedReferral.id, "pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating || selectedReferral.status === "contacted"}
                    onClick={() => updateStatus(selectedReferral.id, "contacted")}
                  >
                    Contacted
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isUpdating || selectedReferral.status === "completed"}
                    onClick={() => updateStatus(selectedReferral.id, "completed")}
                  >
                    Completed
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isUpdating || selectedReferral.status === "cancelled"}
                    onClick={() => updateStatus(selectedReferral.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
