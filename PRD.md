# Interactive Wedding Album PWA

A modern, interactive wedding album that transforms into a family album, combining beautiful design with AI-powered content management and an integrated event calendar.

**Experience Qualities**:
1. **Intimate** - Creating a warm, personal space that feels like flipping through a precious family heirloom with soft touches and romantic atmosphere
2. **Celebratory** - Capturing the joy and excitement of wedding moments through dynamic animations, transitions, and emotional storytelling
3. **Effortless** - Providing seamless navigation and AI-assisted content management so users focus on memories, not technology

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
- This is a full-featured PWA with 7 distinct sections, AI chat admin, calendar widget system, media processing pipeline, offline capabilities, and sophisticated interactive galleries with audio/video integration

## Essential Features

### 1. Seven Thematic Sections
- **Functionality**: Seven distinct pages telling the wedding story chronologically and emotionally: "А якщо" (preparation), "Разом" (ceremony), "Любити" (romance), "Життя" (casual moments), "По справжньому" (guests/celebration), "Радіти" (emotional peaks), "Мріяти" (future wishes)
- **Purpose**: Create a narrative arc that guides visitors through the complete wedding experience
- **Trigger**: Navigation from home page or section-to-section via persistent navigation
- **Progression**: Home page hero → Section selection → Section content with galleries/videos → Interactive elements (modals, lightbox) → Next section
- **Success criteria**: All 7 sections fully populated with 150-200 photos total, smooth transitions, functional interactive galleries

### 2. Integrated Calendar Widget
- **Functionality**: Event calendar present on every page - full widget on home (tear-off calendar + analog clock + date display), compact day-of-week display on other pages that expands on click
- **Purpose**: Bridge wedding album to family album by tracking important dates, future events, anniversaries, and national holidays
- **Trigger**: Always visible on each page; click to expand and view/edit events
- **Progression**: View compact widget → Click to expand → See upcoming events/special dates → Click edit mode → Add/modify events with media attachments
- **Success criteria**: Widget renders on all pages, signals upcoming events with badges, expands smoothly, allows event CRUD operations

### 3. AI Chat Admin
- **Functionality**: Embedded AI assistant for album management - add/remove photos, organize content across sections, manage calendar events, search by semantic tags
- **Purpose**: Enable non-technical users to manage album content without complex interfaces or technical knowledge
- **Trigger**: Click chat icon/widget in corner
- **Progression**: Click icon → Chat opens → User types natural language request ("add photos from first dance") or clicks file attachment icon → AI processes and organizes content → Confirmation
- **Success criteria**: Chat accessible from all pages, file upload icon visible in input, can search/organize photos, manage events, navigate sections

### 4. Interactive Photo Galleries
- **Functionality**: Lazy-loaded image galleries with sliders, lightbox viewer, smooth transitions, semantic tagging
- **Purpose**: Display 150-200 wedding photos beautifully and performantly
- **Trigger**: Page load (lazy), click on photo (lightbox), swipe/arrow navigation (slider)
- **Progression**: User scrolls → Images lazy load → Click photo → Lightbox opens with navigation/description/tags → Arrow keys or swipe to next → Close lightbox
- **Success criteria**: Smooth loading on mobile/desktop, lightbox functional, semantic tags displayed, no performance issues

### 5. Video Integration
- **Functionality**: 2-3 videos per section (14-21 total), adaptive playback, optional background audio in "Любити" section, audio ducking for speech
- **Purpose**: Bring wedding moments to life with motion and sound
- **Trigger**: Auto-play (muted/background) or user click to play
- **Progression**: User enters section → Video preview/poster visible → Click to play → Controls appear → Audio ducks for speech → Video ends or user navigates away
- **Success criteria**: 14-21 videos distributed across sections, smooth playback on mobile, audio controls functional, no autoplay with sound

### 6. PWA Installation & Offline
- **Functionality**: Full PWA with manifest, service worker, "Add to Home Screen" prompt, offline caching of critical assets
- **Purpose**: Enable app-like experience on mobile devices and fast loading even with poor connection
- **Trigger**: User visits site, browser prompts installation
- **Progression**: Visit site → See install prompt → Click "Add to Home Screen" → App installs → Launch from home screen → Works offline
- **Success criteria**: Manifest valid, service worker caches assets, works offline, installable on Android/desktop

### 7. Two Storage Modes
- **Functionality**: Mode A (Local) - IndexedDB for single-device use; Mode B (Family) - Shared backend for multi-device access via KV storage
- **Purpose**: Support both simple single-user and family-collaborative scenarios without forcing registration
- **Trigger**: Initial setup or settings (defaults to Mode B via Spark KV)
- **Progression**: User adds content via chat → Content stored in KV (Mode B) or IndexedDB (Mode A) → Available on current/all devices
- **Success criteria**: Content persists between sessions, Mode B accessible across devices, minimal user configuration

## Edge Case Handling

- **Slow Network**: Progressive loading, show skeletons/placeholders, cache critical assets, degrade video quality gracefully
- **No Internet**: PWA service worker serves cached content, show offline indicator, disable upload features
- **Missing Media**: Show placeholder images, fallback to text descriptions, AI chat suggests adding media
- **Large Files**: Client-side compression before upload, show upload progress, reject files over reasonable limit
- **Calendar Conflicts**: Validate dates, prevent duplicate events, show warnings for past dates
- **Empty Sections**: Display placeholder content encouraging users to add photos via AI chat
- **Browser Compatibility**: Polyfills for older browsers, graceful feature degradation, test on Android Chrome + desktop browsers

## Design Direction

The design should evoke **romantic nostalgia with contemporary elegance** - like opening a treasured heirloom that feels both timeless and modern. The atmosphere is warm, celebratory, intimate, with a soft golden glow throughout, reminiscent of sunset light filtering through sheer curtains. Every interaction should feel precious and intentional, with smooth physics-based animations that respond to touch like delicate paper or silk.

## Color Selection

**Approach**: Vertical gradient with 7° diagonal shift creating a dreamy sky-to-earth transition (blue heaven to golden earth), with one-sided golden highlighting for depth and luxury. All colors in OKLCH for perceptual uniformity.

- **Primary Color**: `oklch(0.91 0.06 85)` (Soft Golden #EAD79A) - Warmth, celebration, precious moments, used for outlines and key accents
- **Secondary Colors**: 
  - Background gradient top: `oklch(0.88 0.04 230)` (#A7D4FF → #8EC7FF) - Ethereal, dreamy, hope
  - Background gradient mid: `oklch(0.95 0.02 180)` (#CFE8F9 → #F0EACA) - Soft transition, peace
  - Background gradient bottom: `oklch(0.89 0.06 80)` (#E8D8A6 → #E4C98F) - Grounded, warm, earth
- **Accent Color**: `oklch(0.85 0.12 75)` (Rich Gold #D9B763) - Highlights, CTAs, important dates, golden glow effects
- **Foreground/Background Pairings**:
  - Body text `oklch(0.24 0 0)` (#2C2C2C) on light background `oklch(0.97 0.01 85)` (#FFF8E1) - Ratio 12.8:1 ✓
  - Captions `oklch(0.38 0 0)` (#4D4D4D) on light background - Ratio 7.4:1 ✓
  - Gold accent text `oklch(0.85 0.12 75)` (#D9B763) on dark sections - Ratio 6.2:1 ✓
  - White text `oklch(0.99 0 0)` on gold accent background - Ratio 5.1:1 ✓

## Font Selection

Typefaces should convey **elegant romance with modern readability** - graceful serifs for emotional moments, clean sans-serifs for practical information, creating a sophisticated wedding magazine aesthetic.

- **Primary Font**: Playfair Display (headings, section titles) - Editorial elegance, romantic sophistication
- **Secondary Font**: Crimson Pro (body text, photo captions) - Readable serif that pairs beautifully with Playfair
- **Accent Font**: Space Grotesk (calendar, UI elements, chat) - Modern geometric contrast, technical precision

**Typographic Hierarchy**:
- H1 (Section Titles): Playfair Display Bold/48px/tight tracking/-0.02em
- H2 (Subsections): Playfair Display SemiBold/32px/normal tracking
- H3 (Card Titles): Crimson Pro SemiBold/24px/normal tracking
- Body (Descriptions): Crimson Pro Regular/18px/1.6 line-height
- Captions (Photo Meta): Crimson Pro Italic/14px/1.4 line-height/muted color
- UI Labels: Space Grotesk Medium/14px/0.01em tracking/uppercase
- Calendar Dates: Space Grotesk Bold/20-28px/tabular numbers

## Animations

**Purpose-driven motion that feels precious and intentional** - every animation should enhance emotional connection. Use subtle spring physics for interactions (damping 0.7, stiffness 100), smooth cross-fades for page transitions (400ms), scroll-triggered reveals with stagger (100ms offset), parallax at 0.3-0.5x speed for depth. The "physical press" interaction (2-3px sink with shadow compression) makes buttons feel like touching real photographs. Reserve faster animations (200ms) for micro-interactions, slower (600ms) for emotional moments like lightbox openings.

**Key moments**: Hero parallax on scroll, staggered gallery reveals, golden glow pulse on calendar events, smooth section transitions with vertical slide + fade, lightbox zoom from clicked image position, chat slide-in from corner with gentle bounce.

## Component Selection

- **Components**:
  - **Card**: Photo containers, event cards, section previews - custom shadow stack (deep + counter + golden side glow)
  - **Dialog**: Lightbox viewer, event editor, settings - full-screen with backdrop blur
  - **Button**: Navigation, CTAs, controls - primary (golden), secondary (transparent with gold outline), ghost (minimal)
  - **ScrollArea**: Gallery containers, chat history - custom scrollbar matching gold theme
  - **Tabs**: Section navigation alternative, calendar view switching
  - **Avatar**: User profile in chat admin
  - **Badge**: Event notifications on calendar widget
  - **Separator**: Section dividers with golden gradient
  - **Progress**: Upload progress, video loading
  - **Tooltip**: Icon explanations, photo metadata on hover
  
- **Customizations**:
  - **Calendar Widget**: Custom component with tear-off aesthetic (home) and compact day badge (sections)
  - **Golden Glow Effect**: CSS radial gradients with position-based highlighting
  - **Volumetric Cards**: Multi-layer shadow system (deep shadow + counter-light + golden side reflection)
  - **AI Chat Panel**: Floating widget with file upload icon integration in input field
  - **Video Player**: Custom controls matching golden theme with ducking indicator
  - **Lightbox Gallery**: Full-screen overlay with semantic tag display and smooth navigation

- **States**:
  - **Buttons**: Default (golden glow), Hover (intensified outline #F4D98A), Active (sink 3px + compressed shadow), Disabled (50% opacity)
  - **Cards**: Default (volumetric), Hover (lift 4px + enhanced glow), Active (sink back to default)
  - **Inputs**: Default (soft inner shadow), Focus (golden ring 2px), Error (red tint), Success (subtle green glow)
  - **Calendar Badge**: Default (subtle), Event Today (pulse animation), Past Event (muted)

- **Icon Selection**:
  - Navigation: `ArrowLeft`, `ArrowRight`, `House`, `List`
  - Media: `Image`, `Video`, `Play`, `Pause`, `SpeakerHigh`, `SpeakerSlash`
  - Actions: `Plus`, `X`, `Check`, `Trash`, `PencilSimple`, `UploadSimple`
  - Calendar: `Calendar`, `CalendarCheck`, `Clock`, `Bell`
  - Chat: `ChatCircle`, `Robot`, `PaperclipHorizontal`, `PaperPlaneTilt`
  - Gallery: `MagnifyingGlassPlus`, `CaretLeft`, `CaretRight`, `GridFour`

- **Spacing**: Base unit 4px (Tailwind default), sections 16-24px gap, galleries 12px gap, cards 20-32px padding, page margins 24-48px responsive

- **Mobile**: 
  - Navigation switches to bottom tab bar on <768px
  - Calendar widget scales down, full widget accessible via modal on mobile
  - Galleries switch to single-column with horizontal swipe
  - Chat takes full screen on mobile instead of sidebar
  - Videos scale to container, controls larger for touch
  - Lightbox fills viewport with minimal chrome
  - Typography scales down 15-20% on mobile while maintaining hierarchy
