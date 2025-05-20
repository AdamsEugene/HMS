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
- Adding new pricing models
- Editing existing pricing models
- Deleting pricing models
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

### PricingModelFormModal

A modal component for adding and editing pricing models with form validation:
- Model name, type, and description
- Status and default model settings
- Service application areas
- Effective dates
- Rate adjustments (markup or discount percentages)
- Additional notes

**Usage:**
```tsx
import { PricingModelFormModal } from './system-configuration';

// In your component:
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedModel, setSelectedModel] = useState<PricingModel | null>(null);

const handleSave = (model: NewPricingModel) => {
  // Handle saving the model
  setIsModalOpen(false);
};

// For adding new model
<PricingModelFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSave}
  isEditing={false}
/>

// For editing existing model
<PricingModelFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSave={handleSave}
  initialModel={selectedModel}
  isEditing={true}
/>
```

### ConfirmationModal

A reusable confirmation modal for actions that require user confirmation, such as deleting models:
- Customizable title and message
- Customizable button text and styling
- Responsive design with accessibility features

**Usage:**
```tsx
import { ConfirmationModal } from './system-configuration';

// In your component:
const [isConfirmOpen, setIsConfirmOpen] = useState(false);

const handleConfirm = () => {
  // Perform the confirmed action
  setIsConfirmOpen(false);
};

<ConfirmationModal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure you want to perform this action?"
  confirmButtonText="Confirm"
  confirmButtonClass="bg-red-600 hover:bg-red-700"
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
- `NewPricingModel`

## Styling

All components use TailwindCSS for styling and support both light and dark modes. They also use the following CSS variables for theming:
- `--color-primary`
- `--color-primary-dark`
- `--shadow-md`
- `--shadow-lg` 