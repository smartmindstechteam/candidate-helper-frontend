�
� Event Management Backend Design (Laravel) 
1. Database Schema 
events 
id (PK, bigint, auto increment) 
title (string, 255) 
type (enum: rally, fundraiser, training, meeting, other) 
category (string, 100) 
timezone (string, 100) 
description (text) 
objective (text, nullable) 
tags (json, nullable) 
priority (enum: low, medium, high) default low 
start_time (datetime) 
end_time (datetime) 
recurrence (enum: none, daily, weekly, custom) default none 
recurrence_rule (json, nullable) 
setup_time (datetime, nullable) 
teardown_time (datetime, nullable) 
venue (string, 255) 
city (string, 100) 
district_id (bigint, FK -> districts.id) 
region_id (bigint, FK -> regions.id) 
address (string, 255) 
lat (decimal 10,7, nullable) 
lng (decimal 10,7, nullable) 
max_capacity (int) 
expected_attendance (int, nullable) 
actual_attendance (int, nullable) 
budget_amount (decimal 12,2) 
estimated_cost (decimal 12,2, nullable) 
funding_source_id (bigint, FK -> funds.id, nullable) 
status (enum: planned, scheduled, in_progress, completed, cancelled) default planned 
media_links (json, nullable) 
organizer_name (string, 150) 
organizer_contact (string, 50) 
backup_contact (string, 50, nullable) 
assigned_operator_id (bigint, FK -> operators.id, nullable) 
risk_assessment (text, nullable) 
contingency_plan (text, nullable) 
feedback_link (string, 255, nullable) 
created_by (bigint, FK -> users.id) 
updated_by (bigint, FK -> users.id) 
timestamps 
2. Eloquent Models 
App\Models\Event 
namespace App\Models; 
use Illuminate\Database\Eloquent\Model; 
class Event extends Model 
{ 
protected $fillable = [ 
'title', 'type', 'category', 'timezone', 'description', 'objective', 
'tags', 'priority', 'start_time', 'end_time', 'recurrence', 
'recurrence_rule', 'setup_time', 'teardown_time', 'venue', 'city', 
        'district_id', 'region_id', 'address', 'lat', 'lng', 'max_capacity', 
        'expected_attendance', 'actual_attendance', 'budget_amount', 'estimated_cost', 
        'funding_source_id', 'status', 'media_links', 'organizer_name', 
        'organizer_contact', 'backup_contact', 'assigned_operator_id', 
        'risk_assessment', 'contingency_plan', 'feedback_link', 'created_by', 'updated_by' 
    ]; 
 
    protected $casts = [ 
        'tags' => 'array', 
        'media_links' => 'array', 
        'recurrence_rule' => 'array', 
        'start_time' => 'datetime', 
        'end_time' => 'datetime', 
        'setup_time' => 'datetime', 
        'teardown_time' => 'datetime', 
    ]; 
 
    // Relationships 
    public function region() { return $this->belongsTo(Region::class); } 
    public function district() { return $this->belongsTo(District::class); } 
    public function operator() { return $this->belongsTo(Operator::class, 'assigned_operator_id'); } 
    public function fundingSource() { return $this->belongsTo(Fund::class, 'funding_source_id'); } 
    public function createdBy() { return $this->belongsTo(User::class, 'created_by'); } 
} 
 
3. Controllers 
App\Http\Controllers\EventController 
Handles CRUD + advanced actions. 
namespace App\Http\Controllers; 
 
use App\Models\Event; 
use Illuminate\Http\Request; 
 
class EventController extends Controller 
{ 
    // List events (with filters: status, region, type, etc.) 
    public function index(Request $request) 
    { 
        $events = Event::query() 
            ->when($request->status, fn($q) => $q->where('status', $request->status)) 
            ->when($request->region_id, fn($q) => $q->where('region_id', $request->region_id)) 
            ->latest() 
            ->paginate(15); 
 
        return response()->json($events); 
    } 
 
    // Show single event 
    public function show(Event $event) 
    { 
        return response()->json($event); 
    } 
 
    // Create event 
    public function store(Request $request) 
    { 
        $validated = $request->validate([ 
            'title' => 'required|string|max:255', 
            'type' => 'required|string', 
            'start_time' => 'required|date', 
            'end_time' => 'required|date|after_or_equal:start_time', 
            'venue' => 'required|string', 
            'city' => 'required|string', 
            'region_id' => 'required|exists:regions,id', 
        ]); 
 
        $event = Event::create(array_merge($validated, [ 
            'created_by' => auth()->id(), 
        ])); 
 
        return response()->json($event, 201); 
    } 
 
    // Update event 
    public function update(Request $request, Event $event) 
    { 
        $this->authorize('update', $event); 
 
        $event->update($request->all()); 
        return response()->json($event); 
    } 
 
    // Delete event 
    public function destroy(Event $event) 
    { 
        $this->authorize('delete', $event); 
        $event->delete(); 
return response()->json(null, 204); 
} 
} 
4. Policies (Access Control) 
App\Policies\EventPolicy 
namespace App\Policies; 
use App\Models\User; 
use App\Models\Event; 
class EventPolicy 
{ 
public function view(User $user, Event $event) 
{ 
} 
return true; // all authenticated can view 
public function create(User $user) 
{ 
} 
return $user->role === 'admin' || $user->role === 'operator'; 
public function update(User $user, Event $event) 
{ 
} 
return $user->role === 'admin' || $user->id === $event->created_by; 
public function delete(User $user, Event $event) 
{ 
return $user->role === 'admin'; 
} 
} 
5. Routes 
routes/api.php 
use App\Http\Controllers\EventController; 
Route::middleware(['auth:sanctum'])->group(function () { 
Route::apiResource('events', EventController::class); 
}); 
6. Services (Optional Layer) 
For AI features, budgeting, or geolocation: 
App\Services\EventService 
namespace App\Services; 
use App\Models\Event; 
class EventService 
{ 
public function predictAttendance(Event $event) 
{ 
} 
// Example AI hook: use past data to estimate attendance 
return round($event->expected_attendance * 0.85); 
public function attachBusRoutes(Event $event) 
{ 
// Link buses from Bus module based on event location 
} 
} 
7. Features to Implement Later 
• ✅ AI-based attendance prediction. 
• ✅ Integration with Google Maps API for venue geocoding. 
• ✅ Bus scheduling sync (auto-assign nearest buses to event). 
• ✅ Notifications system for supporters (SMS/Email/WhatsApp). 
• ✅ QR-code check-in system for attendance verification. 