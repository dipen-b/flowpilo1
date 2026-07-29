# FlowPilot - QA Testing Plan
## Phase 16 & 17 Refinements

**Test Environment:** localhost:3000  
**Browser:** Chrome/Firefox (Desktop)  
**Date Started:** 2026-07-29  
**Tester:** [Your Name]  

---

## 📋 Test Execution Guide

### How to Use This Plan
1. **Go to localhost:3000** in your browser
2. **Login with:** demo@example.com / password123
3. **Follow each test case** in order
4. **Mark as PASS/FAIL** in the checkbox
5. **Note any issues** in the "Notes" column

---

# 🔐 PHASE 16: USER SETTINGS - TEST CASES

## Test Suite 1: Form Validation

### TC-1.1: Full Name Validation
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Navigate to Settings → Profile tab
  2. Clear the "Full Name" field
  3. Click "Save Changes" button
- **Expected:** Red border on field + "Full name is required" error message
- **Actual:** _______________
- **Notes:** _______________

### TC-1.2: Phone Number Validation
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Stay on Settings → Profile tab
  2. Enter invalid phone: "abc123"
  3. Click "Save Changes"
- **Expected:** Red border + "Please enter a valid phone number" error
- **Actual:** _______________
- **Notes:** _______________

### TC-1.3: Valid Phone Format
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Enter valid phone: "+1 (555) 987-6543"
  2. Click "Save Changes"
- **Expected:** No error, save proceeds
- **Actual:** _______________
- **Notes:** _______________

### TC-1.4: Location Validation
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear "Location" field
  2. Click "Save Changes"
- **Expected:** Red border + "Location is required" error
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 2: Data Persistence

### TC-2.1: Profile Changes Persist
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Profile
  2. Change Full Name to "Alice Johnson"
  3. Change Phone to "+1 (555) 111-2222"
  4. Click "Save Changes"
  5. Refresh page (F5)
- **Expected:** Changes still there after refresh
- **Actual:** _______________
- **Notes:** _______________

### TC-2.2: Theme Preference Saved
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Appearance tab
  2. Select "Light Mode"
  3. See success notification
  4. Refresh page
- **Expected:** Theme remains "Light Mode"
- **Actual:** _______________
- **Notes:** _______________

### TC-2.3: Notification Preferences Saved
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Notifications tab
  2. Toggle "Email when assigned to task" OFF
  3. Toggle other preferences
  4. Navigate away and back
- **Expected:** Your toggles remain in same state
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 3: Toast Notifications

### TC-3.1: Success Toast on Save
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Profile
  2. Make a valid change
  3. Click "Save Changes"
- **Expected:** Green toast: "Profile Updated - Your profile changes have been saved successfully"
- **Actual:** _______________
- **Notes:** _______________

### TC-3.2: Error Toast on Validation Fail
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Profile
  2. Clear Full Name field
  3. Click "Save Changes"
- **Expected:** Red toast: "Validation Error - Please fix the errors..."
- **Actual:** _______________
- **Notes:** _______________

### TC-3.3: Theme Change Toast
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Appearance
  2. Click "Dark Mode"
- **Expected:** Blue toast: "Theme Updated - Theme changed to dark mode"
- **Actual:** _______________
- **Notes:** _______________

### TC-3.4: Toast Auto-Dismiss
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Trigger any success toast
  2. Wait 10 seconds without clicking
- **Expected:** Toast auto-disappears after ~10 seconds
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 4: Unsaved Changes Indicator

### TC-4.1: Indicator Appears on Change
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Profile
  2. Change "Full Name" field
- **Expected:** Yellow "Unsaved changes" badge appears in top right
- **Actual:** _______________
- **Notes:** _______________

### TC-4.2: Indicator Disappears on Save
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. (Continued from TC-4.1)
  2. Click "Save Changes"
- **Expected:** "Unsaved changes" badge disappears
- **Actual:** _______________
- **Notes:** _______________

### TC-4.3: Multiple Field Changes Show Indicator
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Change Full Name AND Phone AND Location
- **Expected:** Badge still shows once (not three times)
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 5: Password Strength Meter

### TC-5.1: Weak Password Shows Red
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Account tab
  2. Enter in "New Password": "pass"
- **Expected:** 
  - Red bars (1-2 filled)
  - Text: "Password Strength: Weak"
  - Red error message below
- **Actual:** _______________
- **Notes:** _______________

### TC-5.2: Medium Password Shows Yellow
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear password field
  2. Enter: "Pass1234"
- **Expected:**
  - Yellow bars (3 filled)
  - Text: "Password Strength: Good"
- **Actual:** _______________
- **Notes:** _______________

### TC-5.3: Strong Password Shows Green
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear password
  2. Enter: "SecurePass123!"
- **Expected:**
  - Green bars (5 filled)
  - Text: "Password Strength: Very strong"
  - Button enabled
- **Actual:** _______________
- **Notes:** _______________

### TC-5.4: Weak Password Disables Button
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Enter weak password: "weak"
  2. Try to click "Update Password" button
- **Expected:** Button is disabled (grayed out)
- **Actual:** _______________
- **Notes:** _______________

### TC-5.5: Strong Password Enables Button
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear and enter: "StrongPass123!@"
- **Expected:** "Update Password" button is enabled (clickable)
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 6: Delete Account Confirmation

### TC-6.1: Countdown Timer Appears
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings → Account tab (scroll down)
  2. Click "Delete Account" button
- **Expected:**
  - Modal appears with title "Delete Account"
  - Red warning: "⚠️ This action cannot be undone"
  - Button shows "Delete (3s)"
- **Actual:** _______________
- **Notes:** _______________

### TC-6.2: Countdown Counts Down
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. (Continued from TC-6.1)
  2. Watch the button for 3 seconds
- **Expected:** Button counts: Delete (3s) → (2s) → (1s) → Delete My Account
- **Actual:** _______________
- **Notes:** _______________

### TC-6.3: Button Disabled Until Countdown Ends
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. (Continued from TC-6.1)
  2. Try to click "Delete My Account" button immediately
- **Expected:** Button is disabled, click doesn't work
- **Actual:** _______________
- **Notes:** _______________

### TC-6.4: Button Enabled After Countdown
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Wait for countdown to reach 0
  2. Try to click "Delete My Account"
- **Expected:** Button is now enabled (but don't actually click it)
- **Actual:** _______________
- **Notes:** _______________

### TC-6.5: Cancel Button Works
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Cancel" button
- **Expected:** Modal closes, countdown resets
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 7: Logout Confirmation

### TC-7.1: Logout Confirmation Appears
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Settings sidebar
  2. Click "Logout" button
- **Expected:**
  - Modal: "Confirm Logout"
  - Message: "Are you sure you want to logout?"
  - Cancel & Logout buttons
- **Actual:** _______________
- **Notes:** _______________

### TC-7.2: Cancel Closes Modal
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Cancel" button
- **Expected:** Modal closes, stay on Settings
- **Actual:** _______________
- **Notes:** _______________

---

# 📁 PHASE 17: FILE MANAGEMENT - TEST CASES

## Test Suite 8: File Search

### TC-8.1: Search by Filename
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Navigate to Files page
  2. Search for "project"
- **Expected:**
  - Only "Project Requirements.pdf" shows
  - Count: "Files (1 of 6)"
  - X button appears in search
- **Actual:** _______________
- **Notes:** _______________

### TC-8.2: Search by Uploader Name
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear search
  2. Search for "Sarah"
- **Expected:** "Dashboard Mockup.figma" (by Sarah Wilson) shows
- **Actual:** _______________
- **Notes:** _______________

### TC-8.3: Clear Search with X Button
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Have search active
  2. Click X button in search box
- **Expected:** All 6 files appear, search clears
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 9: File Type Filters

### TC-9.1: Open Filters Panel
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Files page
  2. Click "⚙️ Filters" button
- **Expected:**
  - Dropdown appears
  - "File Type" select with "All Types"
  - "File Size" select with "All Sizes"
- **Actual:** _______________
- **Notes:** _______________

### TC-9.2: Filter by Documents
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click File Type dropdown
  2. Select "Documents"
- **Expected:**
  - Only document files show (4 files)
  - "document ✕" pill appears below filters
  - Count updates
- **Actual:** _______________
- **Notes:** _______________

### TC-9.3: Filter by Images
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear previous filter
  2. Select "Images"
- **Expected:**
  - Only 2 image files show
  - "image ✕" pill appears
- **Actual:** _______________
- **Notes:** _______________

### TC-9.4: Remove Filter with Pill X
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click ✕ on the "image" pill
- **Expected:** All files reappear
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 10: File Size Filters

### TC-10.1: Filter by Small Files (< 1 MB)
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click File Size dropdown
  2. Select "Less than 1 MB"
- **Expected:**
  - Only files under 1 MB show
  - "small ✕" pill appears
- **Actual:** _______________
- **Notes:** _______________

### TC-10.2: Filter by Medium Files (1-10 MB)
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear filter
  2. Select "1 MB - 10 MB"
- **Expected:**
  - Files between 1-10 MB show (most files)
  - "1-10 MB ✕" pill appears
- **Actual:** _______________
- **Notes:** _______________

### TC-10.3: Filter by Large Files (> 10 MB)
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Clear filter
  2. Select "More than 10 MB"
- **Expected:**
  - No files show (none over 10 MB in demo data)
  - Empty state: "No files match your search"
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 11: File Size Formatting

### TC-11.1: Sizes Display in Human-Readable Format
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Files page, look at file list
- **Expected:**
  - Project Requirements.pdf: "2.4 MB"
  - Dashboard Mockup.figma: "5.8 MB"
  - (Not showing raw numbers like 2.4, 5.8)
- **Actual:** _______________
- **Notes:** _______________

### TC-11.2: Size Format in Grid View
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "grid" view button
- **Expected:**
  - Grid cards show formatted sizes
  - Same format as list view
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 12: File Preview Modal

### TC-12.1: Preview Modal Opens
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Files page
  2. Click eye icon on any file
- **Expected:**
  - Dark modal appears
  - File icon shows at top
  - "File Preview" title
- **Actual:** _______________
- **Notes:** _______________

### TC-12.2: All Metadata Displays
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. (Continued from TC-12.1)
  2. Check for all fields
- **Expected:**
  - 📄 File Name
  - 💾 File Size (formatted)
  - 👤 Uploaded By
  - 📅 Uploaded On
  - 📋 Type
  - 📝 Versions
  - Sharing status (Shared with X people / Private)
- **Actual:** _______________
- **Notes:** _______________

### TC-12.3: Formatted Size in Preview
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Check file size in preview modal
- **Expected:** Shows formatted size (e.g., "2.4 MB" not raw)
- **Actual:** _______________
- **Notes:** _______________

### TC-12.4: Close Modal
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Close" button
- **Expected:** Modal closes, back to file list
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 13: Share Permissions Dialog

### TC-13.1: Share Dialog Opens
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Files page
  2. Click share icon on a file
- **Expected:**
  - Modal opens: "Share: [Filename]"
  - 3 share options visible
- **Actual:** _______________
- **Notes:** _______________

### TC-13.2: Private Option Works
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Private" option (lock icon)
- **Expected:**
  - Selected with blue border
  - Shows "Only you can access"
  - No additional options below
- **Actual:** _______________
- **Notes:** _______________

### TC-13.3: Team Option Shows Permissions
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Team" option (users icon)
- **Expected:**
  - Selected with blue border
  - "Allow editing" checkbox appears
  - "Shared with 3 team members" preview shows
  - Expiration date picker appears
- **Actual:** _______________
- **Notes:** _______________

### TC-13.4: Public Option Shows Permissions
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Public" option (globe icon)
- **Expected:**
  - Selected with blue border
  - "Anyone with link can access"
  - Permission checkboxes available
- **Actual:** _______________
- **Notes:** _______________

### TC-13.5: Allow Editing Checkbox
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. With "Team" selected
  2. Check/uncheck "Allow editing"
- **Expected:**
  - Checkbox toggles
  - Description: "Recipients can modify this file"
- **Actual:** _______________
- **Notes:** _______________

### TC-13.6: Expiration Date Picker
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click date input field
- **Expected:**
  - Date picker appears or calendar opens
  - Can select a future date
  - Description: "Access will be revoked after this date"
- **Actual:** _______________
- **Notes:** _______________

### TC-13.7: Close Share Dialog
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click "Done" button
- **Expected:** Modal closes
- **Actual:** _______________
- **Notes:** _______________

---

## Test Suite 14: Upload Modal

### TC-14.1: Upload Modal Opens
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Files page
  2. Click "Upload File" button
- **Expected:**
  - Modal: "Upload Files"
  - Dark backdrop with blur
  - Upload icon visible
- **Actual:** _______________
- **Notes:** _______________

### TC-14.2: File Size Limit Displayed
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Check modal text
- **Expected:**
  - Text shows: "(max 100 MB each)"
  - Clear file size guideline
- **Actual:** _______________
- **Notes:** _______________

### TC-14.3: Supported Formats Listed
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Check bottom of upload modal
- **Expected:**
  - Shows: "📋 Supported formats: PNG, JPG, PDF, DOCX, MP4, ZIP"
- **Actual:** _______________
- **Notes:** _______________

### TC-14.4: Drag Over Highlight
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Drag a file over the drop zone
- **Expected:**
  - Dashed border becomes solid/highlighted
  - Text changes to "Drop files here"
- **Actual:** _______________
- **Notes:** _______________

### TC-14.5: Close Modal
- [ ] **PASS** / [ ] **FAIL**
- **Steps:**
  1. Click X button
- **Expected:** Modal closes
- **Actual:** _______________
- **Notes:** _______________

---

# 📊 QA Test Summary

## Test Results

| Test Suite | Total Tests | Passed | Failed | % Pass |
|-----------|------------|--------|--------|--------|
| Validation | 4 | ___ | ___ | __% |
| Persistence | 3 | ___ | ___ | __% |
| Notifications | 4 | ___ | ___ | __% |
| Unsaved Changes | 3 | ___ | ___ | __% |
| Password Strength | 5 | ___ | ___ | __% |
| Delete Confirm | 5 | ___ | ___ | __% |
| Logout Confirm | 2 | ___ | ___ | __% |
| **Phase 16 Total** | **26** | ___ | ___ | __% |
| File Search | 3 | ___ | ___ | __% |
| Type Filters | 4 | ___ | ___ | __% |
| Size Filters | 3 | ___ | ___ | __% |
| Size Format | 2 | ___ | ___ | __% |
| Preview Modal | 4 | ___ | ___ | __% |
| Share Dialog | 7 | ___ | ___ | __% |
| Upload Modal | 5 | ___ | ___ | __% |
| **Phase 17 Total** | **28** | ___ | ___ | __% |
| **GRAND TOTAL** | **54** | ___ | ___ | __% |

---

## Critical Issues Found

### Issue #1
- **Test Case:** 
- **Severity:** Critical / High / Medium / Low
- **Description:** 
- **Steps to Reproduce:** 
- **Expected:** 
- **Actual:** 
- **Suggested Fix:** 

### Issue #2
- **Test Case:** 
- **Severity:** Critical / High / Medium / Low
- **Description:** 
- **Steps to Reproduce:** 
- **Expected:** 
- **Actual:** 
- **Suggested Fix:** 

---

## Sign-Off

**Tester Name:** ___________________  
**Date Completed:** ___________________  
**Overall Status:** ☐ PASS ☐ FAIL ☐ CONDITIONAL PASS  
**Approved By:** ___________________  

---

## Notes for Development Team

Any additional observations or recommendations:

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

