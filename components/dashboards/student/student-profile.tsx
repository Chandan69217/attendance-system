import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppState } from "@/lib/app-state"
import { useAuth } from "@/lib/auth-context"
import { Save } from "lucide-react"
import { useState } from "react"




export function StudentProfile() {
    const { user } = useAuth()
    const { addToast } = useAppState()
    const [profileData, setProfileData] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        department: user?.department ?? "",
        class: user?.class ?? "",
        id: user?.id ?? "",
    })

    const handleSave = () => {
        addToast({ title: "Profile Updated", description: "Your profile information has been saved.", variant: "success" })
    }

    return (
        <div className="flex flex-col gap-6">
            <div><h3 className="text-lg font-semibold text-foreground">Profile</h3><p className="text-sm text-muted-foreground">Manage your profile information</p></div>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{user?.name.split(" ").map((n) => n[0]).join("") ?? "S"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2"><Label>Full Name</Label><Input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} /></div>
                                <div className="flex flex-col gap-2"><Label>Student ID</Label><Input value={profileData.id} readOnly className="bg-muted" /></div>
                                <div className="flex flex-col gap-2"><Label>Email</Label><Input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} /></div>
                                <div className="flex flex-col gap-2"><Label>Phone</Label><Input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} placeholder="+1-555-0000" /></div>
                                <div className="flex flex-col gap-2"><Label>Department</Label><Input value={profileData.department} readOnly className="bg-muted" /></div>
                                <div className="flex flex-col gap-2"><Label>Class</Label><Input value={profileData.class} readOnly className="bg-muted" /></div>
                            </div>
                            <Button onClick={handleSave} className="gap-2 self-start"><Save className="h-4 w-4" />Save Changes</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}