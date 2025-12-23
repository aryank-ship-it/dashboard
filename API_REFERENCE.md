# Team Members API Reference

## Quick Reference for Backend APIs

---

## 1. Search Registered Users

### **Endpoint Pattern**
```typescript
searchUsers(query: string): Promise<SearchUser[]>
```

### **Implementation**
```typescript
// In useTeamMembers hook
const searchUsers = async (query: string): Promise<SearchUser[]> => {
  if (!query || query.trim().length < 2) return [];

  // Get current team member IDs to exclude
  const { data: currentMembers } = await supabase
    .from('team_members')
    .select('user_id');

  const excludedIds = currentMembers?.map(m => m.user_id) || [];

  // Search profiles excluding current members
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      user_roles!user_roles_user_id_fkey (role)
    `)
    .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
    .not('id', 'in', `(${excludedIds.join(',')})`)
    .limit(10);

  if (error) throw error;
  return data;
};
```

### **Query Parameters**
- `q` (string): Search term (minimum 2 characters)

### **Search Fields**
- `email` - Case-insensitive partial match
- `full_name` - Case-insensitive partial match

### **Response**
```typescript
interface SearchUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member';
}
```

### **Features**
- ✅ Excludes users already in team
- ✅ Paginated (10 results max)
- ✅ Optimized with indexes
- ✅ Case-insensitive search

---

## 2. Add Team Member

### **Endpoint Pattern**
```typescript
addTeamMember.mutateAsync(userId: string): Promise<void>
```

### **Implementation**
```typescript
const addTeamMember = useMutation({
  mutationFn: async (userId: string) => {
    if (!user) throw new Error('User not authenticated');

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      throw new Error('Only admins can add team members');
    }

    // Validate user exists
    const { data: userExists } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!userExists) throw new Error('User not found');

    // Check not already member
    const { data: alreadyMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (alreadyMember) {
      throw new Error('User is already a team member');
    }

    // Insert team member
    const { error } = await supabase
      .from('team_members')
      .insert({ user_id: userId, added_by: user.id });

    if (error) throw error;
  }
});
```

### **Request Body**
```typescript
{
  user_id: string; // UUID of user to add
}
```

### **Validation**
1. ✅ User authenticated
2. ✅ Current user is admin
3. ✅ Target user exists
4. ✅ Target user not already a member

### **Response**
- **Success**: Returns updated team list
- **Error**: Throws error with message

### **Error Messages**
- `"User not authenticated"` - No active session
- `"Only admins can add team members"` - Non-admin attempt
- `"User not found"` - Invalid user_id
- `"User is already a team member"` - Duplicate attempt

---

## 3. List Team Members

### **Endpoint Pattern**
```typescript
useTeamMembers().teamMembers: TeamMemberWithDetails[]
```

### **Implementation**
```typescript
const { data: teamMembers } = useQuery({
  queryKey: ['team-members'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select(`
        id,
        user_id,
        added_by,
        created_at,
        profiles!team_members_user_id_fkey (
          email,
          full_name,
          avatar_url
        ),
        user_roles!user_roles_user_id_fkey (role)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform to flat structure
    return data.map(member => ({
      id: member.id,
      user_id: member.user_id,
      added_by: member.added_by,
      created_at: member.created_at,
      email: member.profiles.email,
      full_name: member.profiles.full_name,
      avatar_url: member.profiles.avatar_url,
      role: member.user_roles.role
    }));
  }
});
```

### **Response**
```typescript
interface TeamMemberWithDetails {
  id: string;              // team_members.id
  user_id: string;         // User's UUID
  added_by: string;        // Admin who added them
  created_at: string;      // ISO timestamp
  email: string;           // From profiles
  full_name: string | null; // From profiles
  avatar_url: string | null; // From profiles
  role: 'admin' | 'member'; // From user_roles
}
```

### **Features**
- ✅ Single optimized query with joins
- ✅ Ordered by creation date (newest first)
- ✅ Includes full user details
- ✅ Cached by React Query

---

## 4. Remove Team Member

### **Endpoint Pattern**
```typescript
removeTeamMember.mutateAsync(memberId: string): Promise<void>
```

### **Implementation**
```typescript
const removeTeamMember = useMutation({
  mutationFn: async (memberId: string) => {
    if (!user) throw new Error('User not authenticated');

    // Check admin role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      throw new Error('Only admins can remove team members');
    }

    // Delete team member
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (error) throw error;
  }
});
```

### **Request**
- `memberId` (string): UUID of team_members record (not user_id)

### **Authorization**
- ✅ Admin role required
- ✅ Enforced at backend level (RLS)
- ✅ Validated in hook

### **Response**
- **Success**: Team list refreshed automatically
- **Error**: Throws error with message

---

## Database Queries (Raw SQL)

### **Search Users (Excluding Team Members)**
```sql
-- Get current team member IDs
SELECT user_id FROM team_members;

-- Search users not in team
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.avatar_url,
  ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id
WHERE (
  p.email ILIKE '%search_term%' 
  OR p.full_name ILIKE '%search_term%'
)
AND p.id NOT IN (SELECT user_id FROM team_members)
LIMIT 10;
```

### **Add Team Member**
```sql
INSERT INTO team_members (user_id, added_by)
VALUES ('user_uuid', 'admin_uuid');
```

### **List Team Members with Details**
```sql
SELECT 
  tm.id,
  tm.user_id,
  tm.added_by,
  tm.created_at,
  p.email,
  p.full_name,
  p.avatar_url,
  ur.role
FROM team_members tm
JOIN profiles p ON tm.user_id = p.id
LEFT JOIN user_roles ur ON tm.user_id = ur.user_id
ORDER BY tm.created_at DESC;
```

### **Remove Team Member**
```sql
DELETE FROM team_members
WHERE id = 'member_id';
```

---

## Authorization Matrix

| Action | Endpoint | Admin | Member | Guest |
|--------|----------|-------|--------|-------|
| View team members | GET | ✅ | ✅ | ❌ |
| Search users | GET | ✅ | ❌ | ❌ |
| Add member | POST | ✅ | ❌ | ❌ |
| Remove member | DELETE | ✅ | ❌ | ❌ |

---

## Performance Considerations

### **Indexes Used**
```sql
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_added_by ON team_members(added_by);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
```

### **Query Optimization**
- ✅ Single query with joins (no N+1)
- ✅ Indexed foreign keys
- ✅ Pagination on search (LIMIT 10)
- ✅ React Query caching

### **Frontend Optimization**
- ✅ Debounced search (300ms)
- ✅ Request cancellation
- ✅ Optimistic updates
- ✅ Memoized filters

---

## Error Handling

### **Common Errors**

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| 401 | User not authenticated | No session | Login required |
| 403 | Only admins can add/remove | Non-admin user | Check user role |
| 404 | User not found | Invalid user_id | Verify user exists |
| 409 | Already a team member | Duplicate add | Check before adding |
| 500 | Database error | Query failed | Check logs |

### **Error Response Format**
```typescript
{
  error: {
    message: string;
    code?: string;
  }
}
```

---

## Usage Examples

### **Search Users**
```typescript
const { searchUsers } = useTeamMembers();

const results = await searchUsers('john');
// Returns users matching "john" in name or email
```

### **Add Team Member**
```typescript
const { addTeamMember } = useTeamMembers();

await addTeamMember.mutateAsync('user-uuid-here');
// Adds user to team, shows toast, refreshes list
```

### **List Team Members**
```typescript
const { teamMembers, isLoading } = useTeamMembers();

if (isLoading) return <Spinner />;
return teamMembers.map(member => <MemberCard {...member} />);
```

### **Remove Team Member**
```typescript
const { removeTeamMember } = useTeamMembers();

await removeTeamMember.mutateAsync('member-id-here');
// Removes member, shows toast, refreshes list
```

---

## Testing with cURL (if you expose REST endpoints)

### **Search Users**
```bash
curl -X GET "https://your-api.com/api/users/search?q=john" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Add Team Member**
```bash
curl -X POST "https://your-api.com/api/team-members" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user-uuid-here"}'
```

### **List Team Members**
```bash
curl -X GET "https://your-api.com/api/team-members" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Remove Team Member**
```bash
curl -X DELETE "https://your-api.com/api/team-members/member-id" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Note**: This implementation uses Supabase client-side SDK with Row Level Security (RLS) policies instead of traditional REST endpoints. The patterns shown here demonstrate the equivalent API structure.
