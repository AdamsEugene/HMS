# System Configuration Components

This directory contains components for the MediHub Central System Configuration module, which is part of the Hospital Administration section.

## Components

### GeneralSettingsForm

A form component for managing general system settings including:
- System name
- Language
- Timezone
- Date and time formats
- Currency
- Session timeout
- Password policies
- Maintenance mode

**Usage:**
```tsx
import { GeneralSettingsForm } from './system-configuration';

// In your component:
const [settings, setSettings] = useState<GeneralSettings>(initialSettings);

// Render the form
<GeneralSettingsForm 
  settings={settings} 
  updateSettings={setSettings} 
/>
```

### OperationalHoursManager

A component for managing hospital operational hours by day of the week. Features include:
- Toggle each day as open/closed
- Add multiple time slots per day
- Validation to prevent overlapping time slots
- Copy schedules from one day to all days

**Usage:**
```tsx
import { OperationalHoursManager } from './system-configuration';

// In your component:
const [hours, setHours] = useState<OperationalHours[]>(initialHours);

// Render the manager
<OperationalHoursManager 
  operationalHours={hours} 
  updateOperationalHours={setHours} 
/>
```

### PricingModelsManager

A component for managing pricing models for patient billing and insurance reimbursement. Features include:
- Viewing existing pricing models
- Status indicators (active/inactive)
- Pricing adjustments (markup/discount percentages)
- Default model designation

**Usage:**
```tsx
import { PricingModelsManager } from './system-configuration';

// In your component:
const [models, setModels] = useState<PricingModel[]>(initialModels);

// Render the manager
<PricingModelsManager 
  pricingModels={models} 
  updatePricingModels={setModels} 
/>
```

## Integration

These components are designed to be used together in the SystemConfiguration component, but they can also be used individually in other parts of the application as needed.

## Data Types

The components use the following data types, which are defined in the `types.ts` file:

- `GeneralSettings`
- `OperationalHours`
- `TimeSlot`
- `DayOfWeek`
- `PricingModel`

## Styling

All components use TailwindCSS for styling and support both light and dark modes. They also use the following CSS variables for theming:
- `--color-primary`
- `--color-primary-dark`
- `--shadow-md`
- `--shadow-lg` 