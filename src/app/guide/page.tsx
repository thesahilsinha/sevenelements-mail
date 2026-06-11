'use client'
import AppLayout from '@/components/ui/Layout'
import { useState } from 'react'
import {
  LayoutDashboard, Users, FileText, Send, Clock,
  ChevronDown, ChevronUp, Upload, Tag, Eye, Mail,
  AlertCircle, CheckCircle, Zap, Settings, BookOpen
} from 'lucide-react'

const BRAND = '#e13a30'

function OverviewContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">Welcome to the <strong>Seven Elements Mailer</strong> — your all-in-one bulk email outreach tool built specifically for Seven Elements Design. This tool lets you manage contacts, create beautiful email templates, run campaigns, and automate newsletters — all from one place.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Zap size={16} /> Quick Start in 4 Steps</p>
        <ol className="space-y-2 text-sm text-blue-700">
          {['Add or import your contacts', 'Create an email template', 'Create a campaign and select recipients', 'Hit Send — and track opens on the dashboard'].map((s, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Daily Send Limit', value: '200 emails/day', note: 'Gmail SMTP limit' },
          { label: 'Access Code', value: '777777', note: 'Keep this private' },
          { label: 'Personalization', value: '{{name}}, {{company}}', note: 'Use in email body' },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="font-mono font-semibold text-gray-800 text-sm">{item.value}</p>
            <p className="text-xs text-gray-400 mt-1">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">The Dashboard is your home screen — it gives you a live snapshot of your outreach activity.</p>
      <div className="space-y-3">
        {[
          { title: 'Total Contacts', desc: 'Total number of prospects saved in the system.' },
          { title: 'Emails Sent', desc: 'Cumulative count of all emails sent across all campaigns.' },
          { title: 'Open Rate', desc: 'Percentage of sent emails that were opened. Tracked via an invisible pixel in each email.' },
          { title: 'Templates', desc: 'Total number of saved email templates.' },
          { title: 'Daily Send Quota', desc: 'Shows how many of your 200 daily emails have been used today. Resets every midnight. Bar turns red above 90%.' },
          { title: 'Recent Campaigns', desc: 'A quick list of your last 5 campaigns with their status — draft, scheduled, or sent.' },
        ].map(item => (
          <div key={item.title} className="flex gap-3">
            <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactsContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">Contacts are your prospects and clients. Each contact stores name, company, email, phone, tags, and a full history of emails sent to them.</p>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800 flex items-center gap-2"><Users size={15} /> Adding Contacts Manually</p>
        </div>
        <div className="p-4 space-y-2 text-sm text-gray-600">
          <p>Click <strong>Add</strong> (top right). Fields: Name*, Email*, Company, Phone, Tags.</p>
          <p>For tags, type a tag name and click <strong>Add</strong>. You can add multiple tags per contact.</p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800 flex items-center gap-2"><Upload size={15} /> Bulk Import via CSV</p>
        </div>
        <div className="p-4 space-y-3 text-sm text-gray-600">
          <p>Click <strong>Import</strong> and upload a CSV. Required columns:</p>
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs overflow-x-auto">
            <p>name,email,company,phone,tags</p>
            <p>John Doe,john@acme.com,Acme Corp,9999999999,prospect;startup</p>
            <p>Jane Smith,jane@brand.in,Brand Co,,ecommerce</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-xs"><strong>Note:</strong> Separate multiple tags with semicolons: <code className="bg-amber-100 px-1 rounded">prospect;startup</code>. Duplicate emails are updated, not duplicated.</p>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800 flex items-center gap-2"><Tag size={15} /> Tags & Filtering</p>
        </div>
        <div className="p-4 text-sm text-gray-600 space-y-2">
          <p>Use the <strong>All Tags</strong> dropdown to filter contacts by tag. Tags also let you target specific groups when building campaigns.</p>
          <p>Useful examples: <code className="bg-gray-100 px-1 rounded">prospect</code> <code className="bg-gray-100 px-1 rounded">client</code> <code className="bg-gray-100 px-1 rounded">startup</code> <code className="bg-gray-100 px-1 rounded">ecommerce</code> <code className="bg-gray-100 px-1 rounded">follow-up</code></p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Sent History per Contact</p>
        </div>
        <div className="p-4 text-sm text-gray-600">
          <p>The <strong>Sent</strong> column shows how many emails have gone to each contact. <strong>Last Sent</strong> shows the date. Use this to avoid over-emailing the same person.</p>
        </div>
      </div>
    </div>
  )
}

function TemplatesContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">Templates are reusable HTML email designs. Build once, use across multiple campaigns. They support full HTML for professional inbox rendering.</p>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Creating a Template</p>
        </div>
        <div className="p-4 space-y-2 text-sm text-gray-600">
          <ul className="space-y-1 ml-4">
            <li>• <strong>Template Name</strong> — internal label only</li>
            <li>• <strong>Subject Line</strong> — what recipients see in their inbox</li>
            <li>• <strong>Preview Text</strong> — short text shown after subject in Gmail/Outlook</li>
            <li>• <strong>Email Body</strong> — paste your HTML here. Switch to Preview tab to see how it renders.</li>
          </ul>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Personalization Variables</p>
        </div>
        <div className="p-4 text-sm text-gray-600 space-y-3">
          <p>These placeholders are replaced with real contact data when sending:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tag: '{{name}}', desc: "Contact's full name", example: 'Rahul Sharma' },
              { tag: '{{company}}', desc: 'Company name', example: 'Acme Corp' },
              { tag: '{{email}}', desc: "Contact's email", example: 'rahul@acme.com' },
            ].map(v => (
              <div key={v.tag} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <code className="text-sm font-mono font-bold" style={{ color: BRAND }}>{v.tag}</code>
                <p className="text-xs text-gray-500 mt-1">{v.desc}</p>
                <p className="text-xs text-gray-400">e.g. {v.example}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs">
            <p>{'<h1>Hi {{name}},</h1>'}</p>
            <p>{'<p>We noticed {{company}} is growing fast...</p>'}</p>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Starter Templates</p>
        </div>
        <div className="p-4 text-sm text-gray-600">
          <p>When no templates exist, two ready-made Seven Elements branded templates appear — <strong>Brand Outreach</strong> and <strong>Newsletter</strong>. Click either to load and customize.</p>
        </div>
      </div>
    </div>
  )
}

function CampaignsContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">Campaigns are one-time bulk email sends to a selected group of contacts. Each campaign tracks sends and opens.</p>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Creating & Sending a Campaign</p>
        </div>
        <div className="p-4 space-y-2 text-sm text-gray-600">
          <ol className="space-y-2">
            {[
              'Click New Campaign',
              'Enter a Campaign Name (internal reference)',
              'Optionally pick a Template — auto-fills subject and body',
              'Edit Subject and Email Body as needed',
              'Optionally set a Schedule date/time',
              'Open Select Recipients — filter by tag or search, click All to select everyone filtered',
              'Click Create Campaign — saves as draft',
              'Back on Campaigns page, click Send to send immediately',
            ].map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold flex-shrink-0" style={{ color: BRAND }}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <p className="text-amber-800 text-xs"><strong>Important:</strong> Once sent, a campaign cannot be resent. Create a new campaign to re-send to contacts.</p>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Campaign Statuses</p>
        </div>
        <div className="p-4 text-sm text-gray-600 space-y-2">
          {[
            { status: 'draft', color: 'bg-gray-100 text-gray-600', desc: 'Created but not sent' },
            { status: 'scheduled', color: 'bg-blue-100 text-blue-700', desc: 'Has a scheduled date set' },
            { status: 'sent', color: 'bg-green-100 text-green-700', desc: 'Successfully sent to all recipients' },
          ].map(s => (
            <div key={s.status} className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.color}`}>{s.status}</span>
              <span>{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800 flex items-center gap-2"><Eye size={15} /> Email Open Tracking</p>
        </div>
        <div className="p-4 text-sm text-gray-600">
          <p>Each email contains an invisible 1x1 tracking pixel. When a recipient opens the email, it registers as an open and updates the campaign open rate shown on the dashboard.</p>
        </div>
      </div>
    </div>
  )
}

function SchedulerContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">The Scheduler lets you set up recurring newsletters that automatically send on a schedule — weekly digests, monthly updates, follow-up sequences and more.</p>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Creating a Scheduler</p>
        </div>
        <div className="p-4 space-y-2 text-sm text-gray-600">
          <ol className="space-y-2">
            {[
              'Click New Scheduler',
              'Enter a name and email subject',
              'Pick a Schedule from the presets or write a custom cron expression',
              'Add Tag filters to target specific contacts — or leave empty for all contacts',
              'Write the HTML email body',
              'Toggle Active on and save',
            ].map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold flex-shrink-0" style={{ color: BRAND }}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Schedule Presets</p>
        </div>
        <div className="p-4 text-sm text-gray-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Every Monday 9 AM', cron: '0 9 * * 1' },
              { label: 'Every day 10 AM', cron: '0 10 * * *' },
              { label: '1st of every month', cron: '0 9 1 * *' },
              { label: 'Every Friday 5 PM', cron: '0 17 * * 5' },
              { label: 'Mon & Thu 9 AM', cron: '0 9 * * 1,4' },
            ].map(p => (
              <div key={p.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <span>{p.label}</span>
                <code className="text-xs bg-gray-200 px-2 py-0.5 rounded font-mono">{p.cron}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800 flex items-center gap-2"><AlertCircle size={15} className="text-amber-500" /> How Auto-Triggers Work</p>
        </div>
        <div className="p-4 text-sm text-gray-600 space-y-2">
          <p>Schedulers run when this URL is called:</p>
          <div className="bg-gray-900 text-green-400 rounded-xl p-3 font-mono text-xs break-all">
            GET https://your-app.vercel.app/api/scheduler/run
          </div>
          <p>Add this to your <code className="bg-gray-100 px-1 rounded">vercel.json</code> for automatic weekly triggering:</p>
          <div className="bg-gray-900 text-green-400 rounded-xl p-3 font-mono text-xs">
            <p>{'{'}</p>
            <p>&nbsp;&nbsp;"crons": [{'{'}"path": "/api/scheduler/run", "schedule": "0 9 * * 1"{'}'}]</p>
            <p>{'}'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function TipsContent() {
  const tips = [
    { title: '✉️ Stay Under 200/Day', desc: 'Gmail SMTP allows ~200 emails/day. Sending more risks your account being flagged. The dashboard shows daily usage in real time.' },
    { title: '🏷️ Use Tags Wisely', desc: 'Tag contacts by industry or pipeline stage. Send targeted campaigns — e.g. only "ecommerce" prospects get your packaging design pitch.' },
    { title: '👤 Always Personalize', desc: 'Emails with {{name}} and {{company}} feel personal and get significantly higher open rates. Never send a generic blast.' },
    { title: '📋 Preview Before Sending', desc: 'Always use the Preview tab to check how your email renders before creating a campaign.' },
    { title: '📅 Space Out Campaigns', desc: "Don't send to the same contacts every day. Check the Last Sent column to know when you last reached out." },
    { title: '🔁 Reuse Templates', desc: 'Build a library for different use cases — cold outreach, follow-up, case study, newsletter. Reuse and tweak rather than starting fresh.' },
    { title: '📊 Track Open Rates', desc: 'A healthy cold email open rate is 20–30%. If yours is lower, test different subject lines — that is the biggest factor.' },
    { title: '🔐 Keep Your Code Safe', desc: 'The access code 777777 is the only protection on this app. Do not share the URL publicly. Change it in your environment variables if needed.' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tips.map(tip => (
        <div key={tip.title} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="font-semibold text-gray-800 mb-1 text-sm">{tip.title}</p>
          <p className="text-sm text-gray-500">{tip.desc}</p>
        </div>
      ))}
    </div>
  )
}

function SmtpContent() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600 leading-relaxed">This app uses your Gmail account via SMTP to send emails. Here is what you need to know.</p>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Gmail App Password Setup</p>
        </div>
        <div className="p-4 text-sm text-gray-600 space-y-2">
          <p>You cannot use your regular Gmail password. Google requires an <strong>App Password</strong>.</p>
          <ol className="space-y-2 ml-4">
            {[
              <>Go to <strong>myaccount.google.com/security</strong></>,
              <>Enable <strong>2-Step Verification</strong></>,
              <>Go to <strong>myaccount.google.com/apppasswords</strong></>,
              <>Create a new App Password — name it "Mailer"</>,
              <>Copy the 16-character password (remove spaces)</>,
              <>Paste it as <code className="bg-gray-100 px-1 rounded">SMTP_PASS</code> in Vercel environment variables</>,
            ].map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-bold flex-shrink-0" style={{ color: BRAND }}>{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="font-semibold text-gray-800">Environment Variables Reference</p>
        </div>
        <div className="p-4">
          <div className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-xs space-y-1">
            <p>SMTP_HOST=smtp.gmail.com</p>
            <p>SMTP_PORT=587</p>
            <p>SMTP_USER=yourgmail@gmail.com</p>
            <p>SMTP_PASS=your16charapppassword</p>
            <p>{'SMTP_FROM=Seven Elements Design <yourgmail@gmail.com>'}</p>
            <p>APP_URL=https://your-app.vercel.app</p>
            <p>ACCESS_CODE=777777</p>
            <p>DAILY_LIMIT=200</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">Set these in Vercel Dashboard → Project → Settings → Environment Variables</p>
        </div>
      </div>
      <div className="border border-red-100 bg-red-50 rounded-xl p-4">
        <p className="font-semibold text-red-800 mb-2 flex items-center gap-2"><AlertCircle size={15} /> If emails are not sending</p>
        <ul className="text-sm text-red-700 space-y-1 ml-4">
          <li>• Double-check App Password has no spaces</li>
          <li>• Make sure 2-Step Verification is enabled on Gmail</li>
          <li>• Verify SMTP_USER matches the Gmail account exactly</li>
          <li>• Check daily limit has not been hit on the dashboard</li>
        </ul>
      </div>
    </div>
  )
}

const sections = [
  { id: 'overview', icon: LayoutDashboard, title: 'Overview & Getting Started', color: '#3b82f6', Component: OverviewContent },
  { id: 'dashboard', icon: LayoutDashboard, title: 'Dashboard', color: '#8b5cf6', Component: DashboardContent },
  { id: 'contacts', icon: Users, title: 'Contacts', color: BRAND, Component: ContactsContent },
  { id: 'templates', icon: FileText, title: 'Email Templates', color: '#10b981', Component: TemplatesContent },
  { id: 'campaigns', icon: Send, title: 'Campaigns', color: '#f59e0b', Component: CampaignsContent },
  { id: 'scheduler', icon: Clock, title: 'Newsletter Scheduler', color: '#06b6d4', Component: SchedulerContent },
  { id: 'tips', icon: Zap, title: 'Best Practices & Tips', color: '#f97316', Component: TipsContent },
  { id: 'smtp', icon: Settings, title: 'SMTP & Email Setup', color: '#64748b', Component: SmtpContent },
]

export default function GuidePage() {
  const [openSection, setOpenSection] = useState<string>('overview')

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl" style={{ background: BRAND + '20' }}>
              <BookOpen size={22} style={{ color: BRAND }} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Guide</h1>
          </div>
          <p className="text-gray-500">Complete manual for Seven Elements Mailer — click any section to expand.</p>
        </div>

        <div className="space-y-3">
          {sections.map(({ id, icon: Icon, title, color, Component }) => {
            const isOpen = openSection === id
            return (
              <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenSection(isOpen ? '' : id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl flex-shrink-0" style={{ background: color + '15' }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <span className="font-semibold text-gray-800">{title}</span>
                  </div>
                  {isOpen ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-6 border-t border-gray-50 pt-4">
                    <Component />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-8 rounded-2xl p-6 text-center" style={{ background: '#1a1a1a' }}>
          <img src="https://sevenelementsdesign.in/wp-content/uploads/2022/01/sticker-04.png" alt="Seven Elements" className="h-10 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Seven Elements Design — Mailer v1.0</p>
          <p className="text-gray-500 text-xs mt-1">For support, contact the development team</p>
        </div>
      </div>
    </AppLayout>
  )
}