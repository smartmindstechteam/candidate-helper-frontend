// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//   Calendar,
//   Plus,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Users,
//   DollarSign,
//   TrendingUp,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { type Event } from "@/types/event";

// export default function EventsPage() {
//   const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [isEditEventOpen, setIsEditEventOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const handleCreateEvent = (event: Event) => {
//     setEvents((prev) => [...prev, event]);
//     setIsCreateEventOpen(false);
//     // Show success message
//     console.log("Event created successfully:", event);
//   };

//   const handleEditEvent = (event: Event) => {
//     setSelectedEvent(event);
//     setIsEditEventOpen(true);
//   };

//   const handleUpdateEvent = (updatedEvent: Event) => {
//     setEvents((prev) =>
//       prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
//     );
//     setIsEditEventOpen(false);
//     setSelectedEvent(null);
//     // Show success message
//     console.log("Event updated successfully:", updatedEvent);
//   };

//   const handleDeleteEvent = (eventToDelete: Event) => {
//     setEvents((prev) => prev.filter((event) => event.id !== eventToDelete.id));
//   };

//   const handleViewEvent = (event: Event) => {
//     // Implement view event functionality
//     console.log("View event:", event);
//   };

//   // Load events data on component mount

//   // Calculate stats from events data

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold text-foreground">
//             Events Management
//           </h2>
//           <p className="text-muted-foreground">
//             Manage campaign events, rallies, meetings, and fundraisers
//           </p>
//         </div>
//         <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
//           <DialogTrigger asChild>
//             <Button className="btn-gradient">
//               <Plus className="mr-2 h-4 w-4" />
//               Create Event
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Create New Event</DialogTitle>
//             </DialogHeader>
//             <EventManagementForm
//               onSuccess={handleCreateEvent}
//               onCancel={() => setIsCreateEventOpen(false)}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Events</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalEvents}</div>
//             <p className="text-xs text-muted-foreground">
//               {totalEvents > 0 ? "+2 from last week" : "No events yet"}
//             </p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{scheduledEvents}</div>
//             <p className="text-xs text-muted-foreground">Upcoming events</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Completed</CardTitle>
//             <CheckCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{completedEvents}</div>
//             <p className="text-xs text-muted-foreground">This month</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               ${totalBudget.toLocaleString()}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               {totalAttendees} total attendees
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Events Data Table */}
//       {loading ? (
//         <div className="flex items-center justify-center h-32">
//           <div className="text-muted-foreground">Loading events...</div>
//         </div>
//       ) : error ? (
//         <div className="flex items-center justify-center h-32">
//           <div className="text-destructive">{error}</div>
//         </div>
//       ) : (
//         <EventsDataTable
//           data={events}
//           onCreateEvent={() => setIsCreateEventOpen(true)}
//           onEditEvent={handleEditEvent}
//           onDeleteEvent={handleDeleteEvent}
//           onViewEvent={handleViewEvent}
//         />
//       )}

//       {/* Edit Event Dialog */}
//       <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
//         <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Event</DialogTitle>
//           </DialogHeader>
//           {selectedEvent && (
//             <EventManagementForm
//               event={selectedEvent}
//               onSuccess={handleUpdateEvent}
//               onCancel={() => {
//                 setIsEditEventOpen(false);
//                 setSelectedEvent(null);
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
export default function EventPage() {
  return <></>;
}
