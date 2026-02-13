import { useRef } from "react"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search } from "lucide-react"

type User = {
    id: string
    name: string
    email: string
}

interface UserSearchSelectProps {
    users: User[]
    value: string
    onChange: (value: string) => void
    onSelect: (user: User) => void
    showOverlay: boolean
    hideCard?:boolean
    placeHolder?:string
    setShowOverlay: (val: boolean) => void
}

export function SearchSelect({
    users,
    value,
    onChange,
    onSelect,
    showOverlay,
    hideCard = true,
    placeHolder = "Search by name or email...",
    setShowOverlay,
}: UserSearchSelectProps) {

    const wrapperRef = useRef<HTMLDivElement>(null)

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase())
    )

    const content = (<div ref={wrapperRef} className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
            placeholder={placeHolder}
            className="pl-10"
            value={value}
            onChange={(e) => {
                onChange(e.target.value)
                setShowOverlay(true)
            }}
            onFocus={() => setShowOverlay(true)}
        />

        {showOverlay && value.trim() && (
            <div className="absolute top-full left-0 right-0 z-20 mt-2">
                <Card className="shadow-md border">
                    <CardContent className="p-0 max-h-[300px] overflow-y-auto">

                        {filteredUsers.length > 0 ? (
                            <Table>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="cursor-pointer hover:bg-muted"
                                            onClick={() => {
                                                onSelect(user)
                                                setShowOverlay(false)
                                            }}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                            {user.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <p className="text-sm font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="py-6 text-center text-muted-foreground">
                                No users found
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        )}
    </div>)

    if(hideCard){
        return content
    }
    return (
        <Card>
            <CardContent className="p-4">
                {content}
            </CardContent>
        </Card>
    )
}
