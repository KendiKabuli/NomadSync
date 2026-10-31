
import { useEffect, useState } from 'react'
import API from './api'
import './App.css'

const meetings = [
  { title: 'Project Check-in', date: 'Today, October 12', time: '10:00 AM EAT', people: '4 participants' },
  { title: 'Weekly Team Meeting', date: 'Tuesday, October 13', time: '2:00 PM EAT', people: '6 participants' },
  { title: 'Planning Session', date: 'Wednesday, October 14', time: '11:00 AM EAT', people: '3 participants' },
]

const timeZones = [
  { city: 'Nairobi', country: 'Kenya', time: 'UTC+3', flag: '🇰🇪' },
  { city: 'London', country: 'United Kingdom', time: 'UTC+1', flag: '🇬🇧' },
  { city: 'Bangkok', country: 'Thailand', time: 'UTC+7', flag: '🇹🇭' },
]

const countries = {
  Kenya: { flag: '🇰🇪', timezone: 'Africa/Nairobi', offset: 'UTC+3' },
  'United Kingdom': { flag: '🇬🇧', timezone: 'Europe/London', offset: 'UTC+0 or UTC+1' },
  Thailand: { flag: '🇹🇭', timezone: 'Asia/Bangkok', offset: 'UTC+7' },
  Netherlands: { flag: '🇳🇱', timezone: 'Europe/Amsterdam', offset: 'UTC+1 or UTC+2' },
  'South Africa': { flag: '🇿🇦', timezone: 'Africa/Johannesburg', offset: 'UTC+2' },
  Vietnam: { flag: '🇻🇳', timezone: 'Asia/Ho_Chi_Minh', offset: 'UTC+7' },
}

const worldCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
  'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh',
  'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia',
  'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic',
  'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica',
  'Croatia', 'Cuba', 'Cyprus', 'Czechia',
  'Democratic Republic of the Congo', 'Denmark', 'Djibouti',
  'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
  'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran',
  'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica',
  'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
  'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
  'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
  'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
  'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States',
  'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela',
  'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
].sort((a, b) => a.localeCompare(b))

const initialTeam = [
  { id: 1, name: 'Alex Morgan', email: 'alex@example.com', country: 'Kenya' },
  { id: 2, name: 'Amina Hassan', email: 'amina@example.com', country: 'Kenya' },
  { id: 3, name: 'Oliver Smith', email: 'oliver@example.com', country: 'United Kingdom' },
  { id: 4, name: 'Nicha Srisai', email: 'nicha@example.com', country: 'Thailand' },
  { id: 5, name: 'Emma de Vries', email: 'emma@example.com', country: 'Netherlands' },
  { id: 6, name: 'Thabo Nkosi', email: 'thabo@example.com', country: 'South Africa' },
  { id: 7, name: 'Linh Nguyen', email: 'linh@example.com', country: 'Vietnam' },
  { id: 8, name: 'Minh Tran', email: 'minh@example.com', country: 'Vietnam' },
]

const initialTasks = [
  { title: 'Complete project proposal', deadline: '2026-10-15', priority: 'High', completed: false },
  { title: 'Prepare team handover', deadline: '2026-10-18', priority: 'Medium', completed: false },
]

const initialHandoverNotes = [
  {
    id: 1,
    title: 'Client presentation preparation',
    memberId: 3,
    memberName: 'Oliver Smith',
    taskTitle: '',
    travelPlanId: '',
    deadline: '2026-10-18',
    priority: 'High',
    details: 'Review the presentation slides and make sure the client meeting documents are ready before Friday.',
    completed: false,
  },
  {
    id: 2,
    title: 'Weekly report follow-up',
    memberId: 4,
    memberName: 'Nicha Srisai',
    taskTitle: '',
    travelPlanId: '',
    deadline: '2026-10-20',
    priority: 'Medium',
    details: 'Follow up on the weekly report and send the final version to the team.',
    completed: false,
  },
]

function App() {
  const [activePage, setActivePage] = useState('Dashboard')

  // Settings state
  const defaultSettings = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    country: 'Kenya',
    timezone: 'Africa/Nairobi',
    workStart: '09:00',
    workEnd: '17:00',
    meetingNotifications: true,
    taskNotifications: true,
    handoverNotifications: true,
    travelNotifications: true,
  }

  const [settings, setSettings] = useState(defaultSettings)
  const [savedSettings, setSavedSettings] = useState(defaultSettings)

  function handleSettingsChange(event) {
    const { name, value, type, checked } = event.target

    const countryTimezones = {
      Kenya: 'Africa/Nairobi',
      Thailand: 'Asia/Bangkok',
      'United Kingdom': 'Europe/London',
      Netherlands: 'Europe/Amsterdam',
      'South Africa': 'Africa/Johannesburg',
      Vietnam: 'Asia/Ho_Chi_Minh',
    }

    setSettings((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'country' && countryTimezones[value]
        ? { timezone: countryTimezones[value] }
        : {}),
    }))
  }

  function handleSaveSettings(event) {
    event.preventDefault()

    if (!settings.name.trim() || !settings.email.trim()) {
      alert('Please enter your name and email address.')
      return
    }

    if (settings.workStart >= settings.workEnd) {
      alert('Your workday end time must be later than the start time.')
      return
    }

    setSavedSettings({ ...settings })
    alert('Settings saved successfully!')
  }

  function handleResetSettings() {
    const confirmed = window.confirm(
      'Are you sure you want to reset your settings to their original values?'
    )

    if (confirmed) {
      setSettings({ ...defaultSettings })
      setSavedSettings({ ...defaultSettings })
    }
  }

  const [meetingList, setMeetingList] = useState(meetings)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDate, setMeetingDate] = useState('')
  const [meetingTime, setMeetingTime] = useState('')
  const [participants, setParticipants] = useState('2')

  const [taskList, setTaskList] = useState([])
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [taskPriority, setTaskPriority] = useState('Medium')

  const [teamMembers, setTeamMembers] = useState(initialTeam)
  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberCountry, setMemberCountry] = useState('Kenya')

  const [travelPlanList, setTravelPlanList] = useState([])
  const [travelMemberId, setTravelMemberId] = useState('')
  const [travelDestination, setTravelDestination] = useState('Thailand')
  const [travelDeparture, setTravelDeparture] = useState('')
  const [travelReturn, setTravelReturn] = useState('')
  const [travelReason, setTravelReason] = useState('')

  const [handoverNoteList, setHandoverNoteList] = useState(initialHandoverNotes)
  const [handoverMemberId, setHandoverMemberId] = useState('')
  const [handoverTitle, setHandoverTitle] = useState('')
  const [handoverDetails, setHandoverDetails] = useState('')
  const [handoverPriority, setHandoverPriority] = useState('Medium')
  const [handoverTaskTitle, setHandoverTaskTitle] = useState('')
  const [handoverTravelPlanId, setHandoverTravelPlanId] = useState('')
  const [handoverDeadline, setHandoverDeadline] = useState('')


  useEffect(() => {
  fetch('http://127.0.0.1:8000/api/team')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }
      return response.json()
    })
    .then((data) => {
      setTeamMembers(data.team_members)
    })
    .catch((error) => {
      console.error('Error fetching team members:', error)
    })
}, [])

useEffect(() => {
  API.get('/tasks')
    .then((response) => {
      const tasks = response.data.tasks.map((task) => ({
        ...task,
        deadline: task.due_date,
        assignedTo: task.assigned_to,
      }))

      setTaskList(tasks)
      console.log('Tasks loaded from database:', tasks)
    })
    .catch((error) => {
      console.error('Error loading tasks:', error)
    })
}, [])

  function handleCreateMeeting(event) {
    event.preventDefault()

    if (!meetingTitle.trim() || !meetingDate || !meetingTime) {
      alert('Please fill in all meeting details.')
      return
    }

    setMeetingList((previous) => [
      ...previous,
      {
        title: meetingTitle.trim(),
        date: meetingDate,
        time: meetingTime,
        people: `${participants} participants`,
      },
    ])

    setMeetingTitle('')
    setMeetingDate('')
    setMeetingTime('')
    setParticipants('2')

    alert('Meeting created successfully!')
  }

async function handleCreateTask(event) {
  event.preventDefault()

  if (!taskTitle.trim() || !taskDeadline) {
    alert('Please enter a task name and deadline.')
    return
  }

  try {
    const response = await API.post('/tasks', {
      title: taskTitle.trim(),
      description: '',
      assigned_to: 'Alex Morgan',
      due_date: taskDeadline,
      priority: taskPriority,
    })

    const newTask = {
      ...response.data.task,
      deadline: response.data.task.due_date,
      assignedTo: response.data.task.assigned_to,
    }

    setTaskList((previous) => [...previous, newTask])

    setTaskTitle('')
    setTaskDeadline('')
    setTaskPriority('Medium')

    alert('Task saved successfully!')
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Could not save task. Please check your backend.')
  }
}


  
async function toggleTask(index) {
  const task = taskList[index]

  if (!task || !task.id) {
    alert('Task ID not found.')
    return
  }

  try {
    const response = await API.put(`/tasks/${task.id}`, {
      completed: !task.completed,
    })

    const updatedTask = response.data.task

    setTaskList((previous) =>
      previous.map((item) =>
        item.id === task.id
          ? {
              ...item,
              ...updatedTask,
              deadline: updatedTask.due_date,
              assignedTo: updatedTask.assigned_to,
            }
          : item
      )
    )

  } catch (error) {
    console.error('Error updating task:', error)
    alert('Could not update task completion status.')
  }
}

async function handleDeleteTask(taskId) {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this task?'
  )

  if (!confirmDelete) {
    return
  }

  try {
    await API.delete(`/tasks/${taskId}`)

    setTaskList((previous) =>
      previous.filter((task) => task.id !== taskId)
    )

    alert('Task deleted successfully!')
  } catch (error) {
    console.error('Error deleting task:', error)
    alert('Could not delete task. Please try again.')
  }
}



 
async function handleAddMember(event) {
  event.preventDefault()

  if (!memberName.trim() || !memberEmail.trim()) {
    alert('Please enter the member name and email.')
    return
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: memberName.trim(),
        email: memberEmail.trim(),
        country: memberCountry,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to add team member')
    }

    const data = await response.json()

    setTeamMembers((previous) => [
      ...previous,
      data.team_member,
    ])

    setMemberName('')
    setMemberEmail('')
    setMemberCountry('Kenya')

    alert('Team member added successfully!')
  } catch (error) {
    console.error('Error adding team member:', error)
    alert('Could not add team member. Please check that the backend is running and try again.')
  }
}


  function handleRemoveMember(memberId) {
    const confirmed = window.confirm(
      'Are you sure you want to remove this team member?'
    )

    if (confirmed) {
      setTeamMembers((previous) =>
        previous.filter((member) => member.id !== memberId)
      )
    }
  }

  function handleCreateTravelPlan(event) {
    event.preventDefault()

    if (
      !travelMemberId ||
      !travelDeparture ||
      !travelReturn ||
      !travelReason.trim()
    ) {
      alert('Please fill in all travel plan details.')
      return
    }

    if (travelReturn < travelDeparture) {
      alert('The return date cannot be before the departure date.')
      return
    }

    const selectedMember = teamMembers.find(
      (member) => member.id === Number(travelMemberId)
    )

    if (!selectedMember) {
      alert('Please select a valid team member.')
      return
    }

    setTravelPlanList((previous) => [
      ...previous,
      {
        id: Date.now(),
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        homeCountry: selectedMember.country,
        destination: travelDestination,
        destinationFlag: countries[travelDestination]?.flag || '🌍',
        departure: travelDeparture,
        returnDate: travelReturn,
        reason: travelReason.trim(),
      },
    ])

    setTravelMemberId('')
    setTravelDestination('Thailand')
    setTravelDeparture('')
    setTravelReturn('')
    setTravelReason('')

    alert('Travel plan added successfully!')
  }

  function handleRemoveTravelPlan(planId) {
    const confirmed = window.confirm(
      'Are you sure you want to remove this travel plan?'
    )

    if (confirmed) {
      setTravelPlanList((previous) =>
        previous.filter((plan) => plan.id !== planId)
      )
    }
  }

  function getTravelStatus(plan) {
    const today = new Date().toISOString().slice(0, 10)

    if (plan.returnDate < today) return 'Completed'
    if (plan.departure > today) return 'Upcoming'

    return 'In progress'
  }

  function formatDate(dateString) {
    if (!dateString) return 'Not set'

    const date = new Date(`${dateString}T00:00:00`)

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Handover Notes functions
  function handleCreateHandoverNote(event) {
    event.preventDefault()

    if (
      !handoverMemberId ||
      !handoverTitle.trim() ||
      !handoverDetails.trim() ||
      !handoverDeadline
    ) {
      alert('Please select a team member and fill in the title, details, and deadline.')
      return
    }

    const selectedMember = teamMembers.find(
      (member) => member.id === Number(handoverMemberId)
    )

    if (!selectedMember) {
      alert('Please select a valid team member.')
      return
    }

    const selectedTravelPlan = handoverTravelPlanId
      ? travelPlanList.find(
          (plan) => plan.id === Number(handoverTravelPlanId)
        )
      : null

    if (
      handoverTravelPlanId &&
      (!selectedTravelPlan ||
        selectedTravelPlan.memberId !== selectedMember.id)
    ) {
      alert('Please select a travel plan belonging to the chosen team member.')
      return
    }

    setHandoverNoteList((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: handoverTitle.trim(),
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        taskTitle: handoverTaskTitle,
        travelPlanId: handoverTravelPlanId,
        deadline: handoverDeadline,
        travelDeparture: selectedTravelPlan?.departure || '',
        travelReturn: selectedTravelPlan?.returnDate || '',
        travelDestination: selectedTravelPlan?.destination || '',
        priority: handoverPriority,
        details: handoverDetails.trim(),
        completed: false,
      },
    ])

    setHandoverMemberId('')
    setHandoverTitle('')
    setHandoverDetails('')
    setHandoverPriority('Medium')
    setHandoverTaskTitle('')
    setHandoverTravelPlanId('')
    setHandoverDeadline('')

    alert('Handover note added successfully!')
  }

  function toggleHandoverNote(noteId) {
    setHandoverNoteList((previous) =>
      previous.map((note) =>
        note.id === noteId
          ? { ...note, completed: !note.completed }
          : note
      )
    )
  }

  function handleRemoveHandoverNote(noteId) {
    const confirmed = window.confirm(
      'Are you sure you want to remove this handover note?'
    )

    if (confirmed) {
      setHandoverNoteList((previous) =>
        previous.filter((note) => note.id !== noteId)
      )
    }
  }

  const activeHandoverCount = handoverNoteList.filter(
    (note) => !note.completed
  ).length

  const completedHandoverCount = handoverNoteList.filter(
    (note) => note.completed
  ).length

  const overdueHandoverCount = handoverNoteList.filter(
    (note) =>
      !note.completed &&
      note.deadline &&
      note.deadline < new Date().toLocaleDateString('en-CA')
  ).length

  const selectedHandoverMember = teamMembers.find(
    (member) => member.id === Number(handoverMemberId)
  )

  const availableHandoverTravelPlans = travelPlanList.filter(
    (plan) => plan.memberId === Number(handoverMemberId)
  )

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">🌐</span>
          <span>NomadSync</span>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="navigation">
          {['Dashboard', 'Meetings', 'My Team', 'Travel Plans', 'Tasks', 'Handover Notes'].map((page) => (
            <button
              key={page}
              className={`nav-link ${activePage === page ? 'active' : ''}`}
              onClick={() => setActivePage(page)}
            >
              {page === 'Dashboard' ? '▦' :
                page === 'Meetings' ? '◷' :
                page === 'My Team' ? '♧' :
                page === 'Travel Plans' ? '✈' :
                page === 'Tasks' ? '✓' : '☷'}{' '}
              {page}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`nav-link ${activePage === 'Settings' ? 'active' : ''}`}
            onClick={() => setActivePage('Settings')}
          >
            ⚙ Settings
          </button>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>{settings.name}</strong>
              <small>Team Member</small>
            </div>
          </div>
        </div>
      </aside>

      {activePage === 'Dashboard' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">MONDAY, OCTOBER 12</p>
              <h1>Good morning, Alex! 👋</h1>
              <p className="subtitle">Here's what's happening with your team today.</p>
            </div>

            <button className="notification" aria-label="Notifications">
              ♧<span className="notification-dot"></span>
            </button>
          </header>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">♧</div>
              <p>Team Members</p>
              <h2>{String(teamMembers.length).padStart(2, '0')}</h2>
              <small>Across different time zones</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">▦</div>
              <p>Upcoming Meetings</p>
              <h2>{String(meetingList.length).padStart(2, '0')}</h2>
              <small>Meetings in your list</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">✓</div>
              <p>Pending Tasks</p>
              <h2>{String(taskList.filter((task) => !task.completed).length).padStart(2, '0')}</h2>
              <small>Tasks to be completed</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✈</div>
              <p>Travel Plans</p>
              <h2>{String(travelPlanList.length).padStart(2, '0')}</h2>
              <small>Upcoming team changes</small>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Upcoming Meetings</h3>
                  <p>Your team's next meetings</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage('Meetings')}
                >
                  View all →
                </button>
              </div>

              {meetingList.slice(0, 3).map((meeting, index) => (
                <div className="meeting-row" key={`${meeting.title}-${index}`}>
                  <div className="calendar-icon">▦</div>

                  <div className="meeting-info">
                    <strong>{meeting.title}</strong>
                    <span>{meeting.date}</span>
                    <small>{meeting.people}</small>
                  </div>

                  <div className="meeting-time">{meeting.time}</div>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Team Time Zones</h3>
                  <p>Where your team works</p>
                </div>
              </div>

              {timeZones.map((zone) => (
                <div className="timezone-row" key={zone.city}>
                  <span className="flag">{zone.flag}</span>

                  <div className="timezone-info">
                    <strong>{zone.city}</strong>
                    <span>{zone.country}</span>
                  </div>

                  <span className="timezone-offset">{zone.time}</span>
                </div>
              ))}

              <p className="timezone-note">
                Time zone offsets can change with the season.
              </p>
            </div>
          </section>

          <section className="content-grid lower-grid">
            <div className="suggestion-panel">
              <div className="suggestion-title">
                <span className="suggestion-icon">✦</span>

                <div>
                  <h3>Smart Meeting Suggestions</h3>
                  <p>Find a time that works for your team</p>
                </div>
              </div>

              <div className="recommended-time">
                <span>RECOMMENDED TIME</span>
                <h2>10:00 AM Nairobi</h2>
                <p>8:00 AM London · 2:00 PM Bangkok</p>
              </div>

              <p className="suggestion-description">
                Suggestions will consider team availability, working hours,
                individual preferences and previous meeting history.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  alert('Smart meeting suggestions will be implemented next.')
                }
              >
                View Suggestions →
              </button>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Task Overview</h3>
                  <p>Keep track of team progress</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage('Tasks')}
                >
                  View all →
                </button>
              </div>

              {taskList.slice(0, 3).map((task, index) => (
                <div className="task-row" key={`${task.title}-${index}`}>
                  <div className="task-info">
                    <strong>{task.title}</strong>
                    <span>
                      {task.completed
                        ? 'Completed'
                        : `Priority: ${task.priority}`}
                    </span>
                  </div>

                  <span
                    className={`status ${
                      task.completed
                        ? 'completed'
                        : task.priority === 'High'
                          ? 'in-progress'
                          : 'pending'
                    }`}
                  >
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <footer className="footer">
            NomadSync · Making global teamwork easier
          </footer>
        </main>
      ) : activePage === 'Meetings' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE / MEETINGS</p>
              <h1>Meetings 📅</h1>
              <p className="subtitle">
                Create and manage your team's meetings.
              </p>
            </div>
          </header>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Create a Meeting</h3>
                <p>Enter the details for your next team meeting.</p>
              </div>
            </div>

            <form className="meeting-form" onSubmit={handleCreateMeeting}>
              <label htmlFor="meetingTitle">Meeting title</label>
              <input
                id="meetingTitle"
                type="text"
                placeholder="e.g. Weekly Team Meeting"
                value={meetingTitle}
                onChange={(event) => setMeetingTitle(event.target.value)}
                required
              />

              <label htmlFor="meetingDate">Meeting date</label>
              <input
                id="meetingDate"
                type="date"
                value={meetingDate}
                onChange={(event) => setMeetingDate(event.target.value)}
                required
              />

              <label htmlFor="meetingTime">Meeting time</label>
              <input
                id="meetingTime"
                type="time"
                value={meetingTime}
                onChange={(event) => setMeetingTime(event.target.value)}
                required
              />

              <label htmlFor="participants">Number of participants</label>
              <select
                id="participants"
                value={participants}
                onChange={(event) => setParticipants(event.target.value)}
              >
                {[2, 3, 4, 5, 6, 7, 8].map((number) => (
                  <option key={number} value={number}>
                    {number} participants
                  </option>
                ))}
              </select>

              <button type="submit" className="primary-button">
                + Create Meeting
              </button>
            </form>
          </section>

          <section className="panel" style={{ marginTop: '24px' }}>
            <div className="panel-heading">
              <div>
                <h3>Upcoming Meetings</h3>
                <p>{meetingList.length} meetings in your list</p>
              </div>
            </div>

            {meetingList.map((meeting, index) => (
              <div className="meeting-row" key={`${meeting.title}-${index}`}>
                <div className="calendar-icon">▦</div>
                <div className="meeting-info">
                  <strong>{meeting.title}</strong>
                  <span>{meeting.date}</span>
                  <small>{meeting.people}</small>
                </div>
                <div className="meeting-time">{meeting.time}</div>
              </div>
            ))}
          </section>
        </main>
      ) : activePage === 'Tasks' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE / TASKS</p>
              <h1>Tasks ✅</h1>
              <p className="subtitle">
                Organize your team's work and deadlines.
              </p>
            </div>
          </header>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Create a Task</h3>
                <p>Add work that needs to be completed.</p>
              </div>
            </div>

            <form className="meeting-form" onSubmit={handleCreateTask}>
              <label htmlFor="taskTitle">Task name</label>
              <input
                id="taskTitle"
                type="text"
                placeholder="e.g. Prepare weekly report"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                required
              />

              <label htmlFor="taskDeadline">Deadline</label>
              <input
                id="taskDeadline"
                type="date"
                value={taskDeadline}
                onChange={(event) => setTaskDeadline(event.target.value)}
                required
              />

              <label htmlFor="taskPriority">Priority</label>
              <select
                id="taskPriority"
                value={taskPriority}
                onChange={(event) => setTaskPriority(event.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button type="submit" className="primary-button">
                + Add Task
              </button>
            </form>
          </section>

          <section className="panel" style={{ marginTop: '24px' }}>
            <div className="panel-heading">
              <div>
                <h3>Team Tasks</h3>
                <p>
                  {taskList.filter((task) => task.completed).length} of{' '}
                  {taskList.length} completed
                </p>
              </div>
            </div>

   
{taskList.map((task, index) => (
  <div className="meeting-row" key={task.id}>
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => toggleTask(index)}
      aria-label={`Mark ${task.title} as completed`}
    />

    <div className="meeting-info">
      <strong
        style={{
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      >
        {task.title}
      </strong>
      <span>Deadline: {task.deadline}</span>
      <small>Priority: {task.priority}</small>
    </div>

    <span>{task.completed ? 'Completed' : 'Pending'}</span>

    <button
      type="button"
      className="secondary-button"
      onClick={() => handleDeleteTask(task.id)}
    >
      Delete
    </button>
  </div>
))}

          </section>
        </main>
      ) : activePage === 'My Team' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE / TEAM</p>
              <h1>My Team 🌍</h1>
              <p className="subtitle">
                Meet the people working across your global team.
              </p>
            </div>
          </header>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">♧</div>
              <p>Team Members</p>
              <h2>{teamMembers.length}</h2>
              <small>People in your workspace</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">🌍</div>
              <p>Countries</p>
              <h2>{new Set(teamMembers.map((member) => member.country)).size}</h2>
              <small>Different countries represented</small>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Add a Team Member</h3>
                <p>Enter their details and select their country.</p>
              </div>
            </div>

            <form className="meeting-form" onSubmit={handleAddMember}>
              <label htmlFor="memberName">Full name</label>
              <input
                id="memberName"
                type="text"
                placeholder="e.g. Jane Doe"
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                required
              />

              <label htmlFor="memberEmail">Email address</label>
              <input
                id="memberEmail"
                type="email"
                placeholder="e.g. jane@example.com"
                value={memberEmail}
                onChange={(event) => setMemberEmail(event.target.value)}
                required
              />

              <label htmlFor="memberCountry">Country</label>
              <select
                id="memberCountry"
                value={memberCountry}
                onChange={(event) => setMemberCountry(event.target.value)}
                required
              >
                {Object.keys(countries).map((country) => (
                  <option key={country} value={country}>
                    {countries[country].flag} {country}
                  </option>
                ))}
              </select>

              <button type="submit" className="primary-button">
                + Add Team Member
              </button>
            </form>
          </section>

          <section className="team-members-section">
            <div className="panel-heading">
              <div>
                <h3>Your Team</h3>
                <p>
                  {teamMembers.length} members across{' '}
                  {new Set(teamMembers.map((member) => member.country)).size}{' '}
                  countries
                </p>
              </div>
            </div>

            {teamMembers.length === 0 ? (
              <div className="panel">
                <p>No team members yet. Add someone using the form above.</p>
              </div>
            ) : (
              <div className="team-grid">
                {teamMembers.map((member) => {
                  const countryInfo = countries[member.country] || {
                    flag: '🌍',
                    timezone: 'Not configured',
                    offset: 'Not configured',
                  }

                  const initials = member.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()

                  return (
                    <article className="team-card" key={member.id}>
                      <div className="team-card-top">
                        <div className="team-avatar">{initials}</div>
                        <span className="team-country-flag" title={member.country}>
                          {countryInfo.flag}
                        </span>
                      </div>

                      <h3 className="team-member-name">{member.name}</h3>
                      <p className="team-member-email">{member.email}</p>
                      <div className="team-card-divider"></div>

                      <div className="team-detail">
                        <span className="team-detail-icon">🌍</span>
                        <div>
                          <small>Country</small>
                          <strong>{member.country}</strong>
                        </div>
                      </div>

                      <div className="team-detail">
                        <span className="team-detail-icon">🕒</span>
                        <div>
                          <small>Time zone</small>
                          <strong>{countryInfo.timezone}</strong>
                          <span>{countryInfo.offset}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="remove-member-button"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove member
                      </button>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <footer className="footer">
            NomadSync · Connecting teams across borders
          </footer>
        </main>
      ) : activePage === 'Travel Plans' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE / TRAVEL PLANS</p>
              <h1>Travel Plans ✈️</h1>
              <p className="subtitle">
                Keep your team updated when members travel to different time zones.
              </p>
            </div>
          </header>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Add a Travel Plan</h3>
                <p>Record a team member's destination and travel dates.</p>
              </div>
            </div>

            <form className="meeting-form" onSubmit={handleCreateTravelPlan}>
              <label htmlFor="travelMember">Team member</label>
              <select
                id="travelMember"
                value={travelMemberId}
                onChange={(event) => setTravelMemberId(event.target.value)}
                required
              >
                <option value="">Select a team member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} — {member.country}
                  </option>
                ))}
              </select>

              <label htmlFor="travelDestination">Destination country</label>
              <select
                id="travelDestination"
                value={travelDestination}
                onChange={(event) => setTravelDestination(event.target.value)}
                required
              >
                {worldCountries.map((country) => (
                  <option key={country} value={country}>
                    {countries[country]?.flag || '🌍'} {country}
                  </option>
                ))}
              </select>

              <label htmlFor="travelDeparture">Departure date</label>
              <input
                id="travelDeparture"
                type="date"
                value={travelDeparture}
                onChange={(event) => setTravelDeparture(event.target.value)}
                required
              />

              <label htmlFor="travelReturn">Return date</label>
              <input
                id="travelReturn"
                type="date"
                min={travelDeparture || undefined}
                value={travelReturn}
                onChange={(event) => setTravelReturn(event.target.value)}
                required
              />

              <label htmlFor="travelReason">Reason for travel</label>
              <textarea
                id="travelReason"
                rows="3"
                placeholder="e.g. Business trip, conference, or temporary relocation"
                value={travelReason}
                onChange={(event) => setTravelReason(event.target.value)}
                required
              />

              <button type="submit" className="primary-button">
                + Add Travel Plan
              </button>
            </form>
          </section>

          <section className="panel" style={{ marginTop: '24px' }}>
            <div className="panel-heading">
              <div>
                <h3>Team Travel Plans</h3>
                <p>{travelPlanList.length} travel plans in your list</p>
              </div>
            </div>

            {travelPlanList.length === 0 ? (
              <p>No travel plans yet. Add a plan using the form above.</p>
            ) : (
              travelPlanList.map((plan) => {
                const destinationInfo = countries[plan.destination] || {
                  flag: plan.destinationFlag || '🌍',
                  timezone: 'Time zone information unavailable',
                  offset: 'Not configured',
                }

                const homeInfo = countries[plan.homeCountry] || {
                  flag: '🌍',
                  timezone: 'Time zone information unavailable',
                  offset: 'Not configured',
                }

                const status = getTravelStatus(plan)

                return (
                  <div className="meeting-row" key={plan.id}>
                    <div className="calendar-icon">{destinationInfo.flag}</div>
                    <div className="meeting-info">
                      <strong>{plan.memberName}</strong>
                      <span>
                        {homeInfo.flag} {plan.homeCountry} → {destinationInfo.flag}{' '}
                        {plan.destination}
                      </span>
                      <small>Departure: {formatDate(plan.departure)} · Return: {formatDate(plan.returnDate)}</small>
                      <small>
                        Destination time zone: {destinationInfo.timezone} ({destinationInfo.offset})
                      </small>
                      <small>Reason: {plan.reason}</small>
                      <small>Status: {status}</small>
                    </div>

                    <button
                      type="button"
                      className="text-button"
                      onClick={() => handleRemoveTravelPlan(plan.id)}
                    >
                      Remove
                    </button>
                  </div>
                )
              })
            )}
          </section>

          <footer className="footer">
            NomadSync · Connecting teams across borders
          </footer>
        </main>
      ) : activePage === 'Handover Notes' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE / HANDOVER NOTES</p>
              <h1>Handover Notes 📝</h1>
              <p className="subtitle">
                Keep work moving when a team member travels or temporarily hands over responsibilities.
              </p>
            </div>
          </header>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">☷</div>
              <p>Active Handovers</p>
              <h2>{String(activeHandoverCount).padStart(2, '0')}</h2>
              <small>Work awaiting completion</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <p>Completed</p>
              <h2>{String(completedHandoverCount).padStart(2, '0')}</h2>
              <small>Handovers finished</small>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">!</div>
              <p>Overdue</p>
              <h2>{String(overdueHandoverCount).padStart(2, '0')}</h2>
              <small>Past their deadline</small>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Create a Handover Note</h3>
                <p>
                  Connect responsibilities, deadlines, tasks and travel plans in one place.
                </p>
              </div>
            </div>

            <form className="meeting-form" onSubmit={handleCreateHandoverNote}>
              <label htmlFor="handoverMember">
                Person taking over the work
              </label>

              <select
                id="handoverMember"
                value={handoverMemberId}
                onChange={(event) => {
                  setHandoverMemberId(event.target.value)
                  setHandoverTravelPlanId('')
                }}
                required
              >
                <option value="">Select the responsible team member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} — {member.country}
                  </option>
                ))}
              </select>

              <label htmlFor="handoverTitle">Handover title</label>
              <input
                id="handoverTitle"
                type="text"
                placeholder="e.g. Cover client communication while I travel"
                value={handoverTitle}
                onChange={(event) => setHandoverTitle(event.target.value)}
                required
              />

              <label htmlFor="handoverTask">Related task (optional)</label>
              <select
                id="handoverTask"
                value={handoverTaskTitle}
                onChange={(event) => setHandoverTaskTitle(event.target.value)}
              >
                <option value="">No linked task</option>
                {taskList.map((task, index) => (
                  <option key={`${task.title}-${index}`} value={task.title}>
                    {task.title} — {task.completed ? 'Completed' : 'Pending'}
                  </option>
                ))}
              </select>

              <label htmlFor="handoverTravelPlan">Related travel plan (optional)</label>
              <select
                id="handoverTravelPlan"
                value={handoverTravelPlanId}
                onChange={(event) => setHandoverTravelPlanId(event.target.value)}
                disabled={!handoverMemberId || availableHandoverTravelPlans.length === 0}
              >
                <option value="">
                  {!handoverMemberId
                    ? 'Select a team member first'
                    : availableHandoverTravelPlans.length === 0
                      ? 'No travel plans for this member'
                      : 'No linked travel plan'}
                </option>
                {availableHandoverTravelPlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.destination} ({formatDate(plan.departure)} – {formatDate(plan.returnDate)})
                  </option>
                ))}
              </select>

              {selectedHandoverMember && (
                <small>
                  Responsible person: {selectedHandoverMember.name} · {selectedHandoverMember.country}
                </small>
              )}

              <label htmlFor="handoverDeadline">Work completion deadline</label>
              <input
                id="handoverDeadline"
                type="date"
                value={handoverDeadline}
                onChange={(event) => setHandoverDeadline(event.target.value)}
                required
              />

              <label htmlFor="handoverDetails">Handover instructions</label>
              <textarea
                id="handoverDetails"
                rows="5"
                placeholder="Explain what needs to be done, the current progress, important contacts, files to check, and what the next person should do."
                value={handoverDetails}
                onChange={(event) => setHandoverDetails(event.target.value)}
                required
              />

              <label htmlFor="handoverPriority">Priority</label>
              <select
                id="handoverPriority"
                value={handoverPriority}
                onChange={(event) => setHandoverPriority(event.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>

              <button type="submit" className="primary-button">
                + Create Handover
              </button>
            </form>
          </section>

          <section className="panel" style={{ marginTop: '24px' }}>
            <div className="panel-heading">
              <div>
                <h3>Team Handover Notes</h3>
                <p>
                  {activeHandoverCount} active · {completedHandoverCount} completed
                </p>
              </div>
            </div>

            {handoverNoteList.length === 0 ? (
              <p>
                No handovers yet. Create a handover above to keep responsibilities organized.
              </p>
            ) : (
              handoverNoteList.map((note) => {
                const linkedTravelPlan = note.travelPlanId
                  ? travelPlanList.find(
                      (plan) => plan.id === Number(note.travelPlanId)
                    )
                  : null

                const travelDeparture =
                  linkedTravelPlan?.departure || note.travelDeparture

                const travelReturn =
                  linkedTravelPlan?.returnDate || note.travelReturn

                const travelDestination =
                  linkedTravelPlan?.destination || note.travelDestination

                const isOverdue =
                  !note.completed &&
                  note.deadline &&
                  note.deadline < new Date().toLocaleDateString('en-CA')

                const linkedTask = note.taskTitle
                  ? taskList.find((task) => task.title === note.taskTitle)
                  : null

                return (
                  <article
                    className="meeting-row"
                    key={note.id}
                    style={{
                      alignItems: 'flex-start',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() => toggleHandoverNote(note.id)}
                      aria-label={`Mark ${note.title} as completed`}
                      style={{ marginTop: '5px' }}
                    />

                    <div
                      className="meeting-info"
                      style={{ flex: 1, minWidth: 0 }}
                    >
                      <strong
                        style={{
                          textDecoration: note.completed ? 'line-through' : 'none',
                        }}
                      >
                        {note.title}
                      </strong>

                      <span>👤 Taking over: {note.memberName}</span>

                      <small>
                        📋 Related task: {note.taskTitle || 'No linked task'}
                      </small>

                      <small>
                        🗓️ Deadline: {formatDate(note.deadline)}
                      </small>

                      {travelDestination && (
                        <small>
                          ✈️ Travel destination: {travelDestination}
                        </small>
                      )}

                      {travelDeparture && travelReturn && (
                        <small>
                          Travel dates: {formatDate(travelDeparture)} – {formatDate(travelReturn)}
                        </small>
                      )}

                      <small>Priority: {note.priority}</small>

                      <p
                        style={{
                          whiteSpace: 'pre-wrap',
                          overflowWrap: 'anywhere',
                          margin: '8px 0',
                        }}
                      >
                        {note.details}
                      </p>

                      {linkedTask && (
                        <small>
                          Linked task status: {linkedTask.completed ? 'Completed' : 'Pending'}
                        </small>
                      )}

                      <span
                        className={`status ${
                          note.completed
                            ? 'completed'
                            : isOverdue
                              ? 'in-progress'
                              : 'pending'
                        }`}
                      >
                        {note.completed
                          ? 'Completed'
                          : isOverdue
                            ? 'Overdue'
                            : 'Pending'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-button"
                      onClick={() => handleRemoveHandoverNote(note.id)}
                    >
                      Remove
                    </button>
                  </article>
                )
              })
            )}
          </section>

          <footer className="footer">
            NomadSync · Keeping work moving across time zones
          </footer>
        </main>
      ) : activePage === 'Settings' ? (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE / SETTINGS</p>
              <h1>Settings ⚙️</h1>
              <p className="subtitle">
                Manage your profile, time zone, working hours and notifications.
              </p>
            </div>
          </header>

          <form onSubmit={handleSaveSettings}>
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Profile Information</h3>
                  <p>Update your personal workspace details.</p>
                </div>
              </div>

              <div className="meeting-form">
                <label htmlFor="settingsName">Full name</label>
                <input
                  id="settingsName"
                  name="name"
                  type="text"
                  value={settings.name}
                  onChange={handleSettingsChange}
                  placeholder="Enter your full name"
                  required
                />

                <label htmlFor="settingsEmail">Email address</label>
                <input
                  id="settingsEmail"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleSettingsChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </section>

            <section className="panel" style={{ marginTop: '24px' }}>
              <div className="panel-heading">
                <div>
                  <h3>Time Zone Preferences 🌍</h3>
                  <p>
                    Set your home country and time zone for global collaboration.
                  </p>
                </div>
              </div>

              <div className="meeting-form">
                <label htmlFor="settingsCountry">Home country</label>
                <select
                  id="settingsCountry"
                  name="country"
                  value={settings.country}
                  onChange={handleSettingsChange}
                  required
                >
                  {worldCountries.map((country) => (
                    <option key={country} value={country}>
                      {countries[country]?.flag || '🌍'} {country}
                    </option>
                  ))}
                </select>

                <label htmlFor="settingsTimezone">Preferred time zone</label>
                <select
                  id="settingsTimezone"
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleSettingsChange}
                  required
                >
                  <option value="Africa/Nairobi">Africa/Nairobi — Kenya</option>
                  <option value="Europe/London">Europe/London — United Kingdom</option>
                  <option value="Asia/Bangkok">Asia/Bangkok — Thailand</option>
                  <option value="Europe/Amsterdam">Europe/Amsterdam — Netherlands</option>
                  <option value="Africa/Johannesburg">Africa/Johannesburg — South Africa</option>
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh — Vietnam</option>
                  <option value="UTC">UTC — Coordinated Universal Time</option>
                </select>

                <small>
                  Your preferred time zone is used as your home time reference.
                  You can change it whenever your circumstances change.
                </small>
              </div>
            </section>

            <section className="panel" style={{ marginTop: '24px' }}>
              <div className="panel-heading">
                <div>
                  <h3>Working Hours 🕒</h3>
                  <p>
                    Set the hours when you are normally available to collaborate.
                  </p>
                </div>
              </div>

              <div className="meeting-form">
                <label htmlFor="settingsWorkStart">Workday starts</label>
                <input
                  id="settingsWorkStart"
                  name="workStart"
                  type="time"
                  value={settings.workStart}
                  onChange={handleSettingsChange}
                  required
                />

                <label htmlFor="settingsWorkEnd">Workday ends</label>
                <input
                  id="settingsWorkEnd"
                  name="workEnd"
                  type="time"
                  value={settings.workEnd}
                  onChange={handleSettingsChange}
                  required
                />

                <small>
                  These hours describe your availability. Automatic scheduling
                  based on these settings can be added later.
                </small>
              </div>
            </section>

       <section className="panel" style={{ marginTop: '24px' }}>
  <div className="panel-heading">
    <div>
      <h3>Notification Preferences 🔔</h3>
      <p>Choose which workspace updates you want to enable.</p>
    </div>
  </div>

  <div
    className="settings-notifications"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginTop: '24px',
    }}
  >
    <label
      className="settings-checkbox"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid #E8EAF0',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        name="meetingNotifications"
        checked={settings.meetingNotifications}
        onChange={handleSettingsChange}
        style={{ marginTop: '4px' }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <strong>Meeting notifications</strong>
        <small>Updates about team meetings and schedules.</small>
      </span>
    </label>

    <label
      className="settings-checkbox"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid #E8EAF0',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        name="taskNotifications"
        checked={settings.taskNotifications}
        onChange={handleSettingsChange}
        style={{ marginTop: '4px' }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <strong>Task notifications</strong>
        <small>Reminders about tasks and deadlines.</small>
      </span>
    </label>

    <label
      className="settings-checkbox"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid #E8EAF0',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        name="handoverNotifications"
        checked={settings.handoverNotifications}
        onChange={handleSettingsChange}
        style={{ marginTop: '4px' }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <strong>Handover notifications</strong>
        <small>
          Updates about assigned handovers and responsibilities.
        </small>
      </span>
    </label>

    <label
      className="settings-checkbox"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        name="travelNotifications"
        checked={settings.travelNotifications}
        onChange={handleSettingsChange}
        style={{ marginTop: '4px' }}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <strong>Travel notifications</strong>
        <small>
          Updates about team travel plans and destination changes.
        </small>
      </span>
    </label>
  </div>
</section>

            <section className="panel" style={{ marginTop: '24px' }}>
              <div className="panel-heading">
                <div>
                  <h3>Save Preferences</h3>
                  <p>
                    {JSON.stringify(settings) === JSON.stringify(savedSettings)
                      ? 'Your current settings are saved.'
                      : 'You have unsaved changes.'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <button type="submit" className="primary-button">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="text-button"
                  onClick={handleResetSettings}
                >
                  Reset Settings
                </button>
              </div>
            </section>
          </form>

          <footer className="footer">
            NomadSync · Personalizing your global workspace
          </footer>
        </main>
      ) : (
        <main className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">WORKSPACE</p>
              <h1>{activePage}</h1>
              <p className="subtitle">
                Welcome to your NomadSync {activePage.toLowerCase()} page.
              </p>
            </div>
          </header>

          <section className="panel">
            <h3>{activePage}</h3>
            <p>
              This section is ready for us to build.
              We'll add its functionality step by step.
            </p>
            <button
              className="primary-button"
              onClick={() => setActivePage('Dashboard')}
            >
              ← Back to Dashboard
            </button>
          </section>
        </main>
      )}
    </div>
  )
}

export default App
