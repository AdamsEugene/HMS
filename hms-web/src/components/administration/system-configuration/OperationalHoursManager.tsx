import { useState } from "react";
import type { OperationalHours, TimeSlot, DayOfWeek } from "../types";
import {
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface OperationalHoursManagerProps {
  operationalHours: OperationalHours[];
  updateOperationalHours: (hours: OperationalHours[]) => void;
}

const OperationalHoursManager: React.FC<OperationalHoursManagerProps> = ({
  operationalHours,
  updateOperationalHours,
}) => {
  const [hoursData, setHoursData] =
    useState<OperationalHours[]>(operationalHours);
  const [isSaved, setIsSaved] = useState(false);

  // Handle toggling a day's open status
  const handleToggleDay = (dayOfWeek: DayOfWeek) => {
    const updatedHours = hoursData.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        // If toggling from closed to open, add a default time slot
        const newTimeSlots =
          !day.isOpen && day.timeSlots.length === 0
            ? [{ from: "09:00", to: "17:00" }]
            : day.timeSlots;

        return {
          ...day,
          isOpen: !day.isOpen,
          timeSlots: newTimeSlots,
        };
      }
      return day;
    });

    setHoursData(updatedHours);
  };

  // Handle adding a new time slot to a day
  const handleAddTimeSlot = (dayOfWeek: DayOfWeek) => {
    const updatedHours = hoursData.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        // Find the last time slot to determine a reasonable new slot
        const lastSlot = day.timeSlots[day.timeSlots.length - 1];
        let newFrom = "09:00";
        let newTo = "17:00";

        if (lastSlot) {
          // Try to create a slot after the last one with 1-hour gap
          const lastToHour = parseInt(lastSlot.to.split(":")[0], 10);
          const lastToMinute = lastSlot.to.split(":")[1];

          if (lastToHour < 23) {
            newFrom = `${lastToHour + 1}:${lastToMinute}`;
            newTo = `${Math.min(lastToHour + 3, 23)}:${lastToMinute}`;
          }
        }

        return {
          ...day,
          timeSlots: [...day.timeSlots, { from: newFrom, to: newTo }],
        };
      }
      return day;
    });

    setHoursData(updatedHours);
  };

  // Handle removing a time slot from a day
  const handleRemoveTimeSlot = (dayOfWeek: DayOfWeek, index: number) => {
    const updatedHours = hoursData.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        const newTimeSlots = [...day.timeSlots];
        newTimeSlots.splice(index, 1);

        return {
          ...day,
          timeSlots: newTimeSlots,
          // If removing the last time slot, set isOpen to false
          isOpen: newTimeSlots.length > 0 ? day.isOpen : false,
        };
      }
      return day;
    });

    setHoursData(updatedHours);
  };

  // Handle changing time slot values
  const handleTimeSlotChange = (
    dayOfWeek: DayOfWeek,
    index: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const updatedHours = hoursData.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        const newTimeSlots = [...day.timeSlots];
        newTimeSlots[index] = {
          ...newTimeSlots[index],
          [field]: value,
        };

        return {
          ...day,
          timeSlots: newTimeSlots,
        };
      }
      return day;
    });

    setHoursData(updatedHours);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOperationalHours(hoursData);
    setIsSaved(true);

    // Reset saved message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  // Copy hours from one day to the entire week
  const handleCopyToWeek = (dayOfWeek: DayOfWeek) => {
    const sourceDayData = hoursData.find((day) => day.dayOfWeek === dayOfWeek);

    if (!sourceDayData) return;

    const updatedHours = hoursData.map((day) => {
      if (day.dayOfWeek !== dayOfWeek) {
        return {
          ...day,
          isOpen: sourceDayData.isOpen,
          timeSlots: [...sourceDayData.timeSlots],
        };
      }
      return day;
    });

    setHoursData(updatedHours);
  };

  // Time slot validation
  const validateTimeSlots = (day: OperationalHours) => {
    if (!day.isOpen || day.timeSlots.length === 0) return true;

    // Check for overlapping time slots
    const sortedSlots = [...day.timeSlots].sort((a, b) => {
      return a.from.localeCompare(b.from);
    });

    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentSlot = sortedSlots[i];
      const nextSlot = sortedSlots[i + 1];

      if (currentSlot.to > nextSlot.from) {
        return false; // Overlapping slots
      }
    }

    // Check for invalid time ranges (to < from)
    for (const slot of day.timeSlots) {
      if (slot.to <= slot.from) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Hospital Operational Hours
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Set the operating hours for each day of the week. These hours will be
          used for patient scheduling and resource allocation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Days of the week */}
        <div className="space-y-6">
          {hoursData.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`border rounded-lg p-4 ${
                validateTimeSlots(day)
                  ? "border-gray-200 dark:border-gray-700"
                  : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {/* Day toggle switch */}
                  <button
                    type="button"
                    aria-label={`Toggle ${day.dayOfWeek} ${day.isOpen ? "closed" : "open"}`}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      day.isOpen ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    }`}
                    onClick={() => handleToggleDay(day.dayOfWeek)}
                  >
                    <span
                      className={`${
                        day.isOpen ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </button>
                  <span className="ml-3 font-medium">{day.dayOfWeek}</span>
                  <span
                    className={`ml-2 text-sm ${
                      day.isOpen
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {day.isOpen ? "Open" : "Closed"}
                  </span>
                </div>

                {day.isOpen && (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary-dark"
                      onClick={() => handleCopyToWeek(day.dayOfWeek)}
                    >
                      Copy to all days
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary bg-primary-light/10 hover:bg-primary-light/20"
                      onClick={() => handleAddTimeSlot(day.dayOfWeek)}
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Time Slot
                    </button>
                  </div>
                )}
              </div>

              {!validateTimeSlots(day) && (
                <div className="mb-4 bg-red-100 dark:bg-red-900/20 p-2 rounded-md text-sm text-red-600 dark:text-red-400">
                  Error: Time slots must not overlap, and end time must be after
                  start time.
                </div>
              )}

              {day.isOpen && (
                <div className="space-y-3">
                  {day.timeSlots.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No operating hours defined. Add a time slot.
                    </p>
                  ) : (
                    day.timeSlots.map((timeSlot, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="grid grid-cols-2 gap-2 flex-grow">
                          <div>
                            <label
                              htmlFor={`${day.dayOfWeek}-from-${index}`}
                              className="sr-only"
                            >
                              From
                            </label>
                            <input
                              type="time"
                              id={`${day.dayOfWeek}-from-${index}`}
                              value={timeSlot.from}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  day.dayOfWeek,
                                  index,
                                  "from",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`${day.dayOfWeek}-to-${index}`}
                              className="sr-only"
                            >
                              To
                            </label>
                            <input
                              type="time"
                              id={`${day.dayOfWeek}-to-${index}`}
                              value={timeSlot.to}
                              onChange={(e) =>
                                handleTimeSlotChange(
                                  day.dayOfWeek,
                                  index,
                                  "to",
                                  e.target.value
                                )
                              }
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove time slot for ${day.dayOfWeek}`}
                          onClick={() =>
                            handleRemoveTimeSlot(day.dayOfWeek, index)
                          }
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon
                className="h-5 w-5 text-blue-400 dark:text-blue-300"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Operating hours affect appointment scheduling, resource
                availability, and patient portal display.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          {isSaved && (
            <div className="mr-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Operating hours saved successfully
            </div>
          )}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={hoursData.some((day) => !validateTimeSlots(day))}
          >
            Save Operating Hours
          </button>
        </div>
      </form>
    </div>
  );
};

export default OperationalHoursManager;
