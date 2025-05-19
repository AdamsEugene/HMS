import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import { NavLink } from "react-router-dom";
import {
  XMarkIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserIcon,
  AcademicCapIcon,
  CubeIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChartPieIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";

// Grouped navigation items
const navigationGroups = [
  {
    name: "Core",
    items: [
      { name: "Dashboard", href: "/", icon: HomeIcon },
      {
        name: "Administration",
        href: "/administration",
        icon: BuildingOffice2Icon,
      },
      { name: "Patient Management", href: "/patients", icon: UserGroupIcon },
    ],
  } as const,
  {
    name: "Clinical",
    items: [
      {
        name: "Clinical Services",
        href: "/clinical",
        icon: ClipboardDocumentCheckIcon,
      },
      { name: "Diagnostic Services", href: "/diagnostic", icon: BeakerIcon },
      { name: "Pharmacy", href: "/pharmacy", icon: BeakerIcon },
      { name: "Telemedicine", href: "/telemedicine", icon: VideoCameraIcon },
    ],
  } as const,
  {
    name: "Management",
    items: [
      { name: "Staff Management", href: "/staff", icon: UserIcon },
      { name: "HR & Workforce", href: "/hr", icon: UserGroupIcon },
      {
        name: "Education & Training",
        href: "/education",
        icon: AcademicCapIcon,
      },
      { name: "Equipment Management", href: "/equipment", icon: CubeIcon },
    ],
  } as const,
  {
    name: "Support",
    items: [
      { name: "Inventory", href: "/inventory", icon: CubeIcon },
      { name: "Finance", href: "/finance", icon: CurrencyDollarIcon },
      {
        name: "Quality Management",
        href: "/quality",
        icon: PresentationChartLineIcon,
      },
      { name: "Compliance", href: "/compliance", icon: ShieldCheckIcon },
    ],
  } as const,
  {
    name: "Analytics",
    items: [
      { name: "Analytics", href: "/analytics", icon: ChartPieIcon },
      { name: "Reports", href: "/reports", icon: DocumentTextIcon },
    ],
  } as const,
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  compact?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  organization?: {
    id: number;
    name: string;
    logo: string;
    color: string;
  };
}

const Sidebar = ({
  open,
  setOpen,
  compact = false,
  onCollapse,
  organization = {
    id: 1,
    name: "MediHub",
    logo: "https://placehold.co/100x40/3B82F6/FFFFFF?text=MediHub",
    color: "#3B82F6",
  },
}: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(compact);

  // Update collapsed state if compact prop changes
  useEffect(() => {
    setCollapsed(compact);
  }, [compact]);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onCollapse) {
      onCollapse(newCollapsedState);
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="sidebar-toggle-button"
                      onClick={() => setOpen(false)}
                      aria-label="Close sidebar"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="sidebar-icon" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                {/* Mobile Sidebar content */}
                <div
                  className="sidebar-container sidebar-mobile custom-scrollbar"
                  style={
                    {
                      "--sidebar-accent": organization.color,
                    } as React.CSSProperties
                  }
                >
                  <div className="sidebar-header flex items-center justify-between border-b border-gray-700 p-4">
                    {collapsed ? (
                      <div className="flex justify-center w-full">
                        <img
                          src={organization.logo}
                          alt={organization.name}
                          className="h-8"
                        />
                      </div>
                    ) : (
                      <h1 className="text-lg font-bold">{organization.name}</h1>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden flex flex-col">
                    <nav className="flex-1 p-4 custom-scrollbar">
                      <ul className="flex flex-col gap-y-7">
                        {navigationGroups.map((group) => (
                          <li key={group.name}>
                            <Disclosure defaultOpen={true}>
                              {({ open }) => (
                                <>
                                  <Disclosure.Button className="w-full flex justify-between items-center p-2 text-left text-gray-300 hover:bg-gray-700 rounded-md">
                                    <span>{group.name}</span>
                                    <ChevronDownIcon
                                      className={cn(
                                        "h-5 w-5 text-gray-400",
                                        open ? "rotate-180 transform" : ""
                                      )}
                                    />
                                  </Disclosure.Button>
                                  <Transition
                                    enter="transition duration-100 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition duration-75 ease-out"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                  >
                                    <Disclosure.Panel className="mt-1 space-y-1">
                                      {group.items.map((item) => (
                                        <NavLink
                                          key={item.name}
                                          to={item.href}
                                          className={({ isActive }) =>
                                            cn(
                                              "sidebar-item flex items-center px-2 py-2 text-sm",
                                              isActive && "sidebar-item-active"
                                            )
                                          }
                                          onClick={() => setOpen(false)}
                                        >
                                          <item.icon
                                            className="sidebar-icon h-5 w-5 mr-3"
                                            aria-hidden="true"
                                          />
                                          <span>{item.name}</span>
                                        </NavLink>
                                      ))}
                                    </Disclosure.Panel>
                                  </Transition>
                                </>
                              )}
                            </Disclosure>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:flex-col sidebar-container",
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        )}
        style={
          { "--sidebar-accent": organization.color } as React.CSSProperties
        }
      >
        <div className="sidebar-header flex items-center justify-between border-b border-gray-700 p-4">
          {collapsed ? (
            <div className="flex justify-center py-2 w-full">
              <img
                src={organization.logo}
                alt={organization.name}
                className="h-8"
              />
            </div>
          ) : (
            <>
              <img
                src={organization.logo}
                alt={organization.name}
                className="h-8"
              />
              <button
                onClick={toggleSidebar}
                className="sidebar-toggle-button rounded-full p-1 hover:bg-gray-700"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>

        {/* Desktop nav */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {collapsed ? (
            <div className="flex justify-center p-2">
              <button
                onClick={toggleSidebar}
                className="sidebar-toggle-button rounded-full p-1 hover:bg-gray-700"
                aria-label="Expand sidebar"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <nav className="flex-1 p-4 custom-scrollbar">
            <ul className="flex flex-col gap-y-7">
              {navigationGroups.map((group) => (
                <li key={group.name}>
                  {!collapsed && (
                    <h3 className="text-xs font-semibold uppercase text-gray-400 px-2 mb-2">
                      {group.name}
                    </h3>
                  )}
                  <ul className={cn("space-y-1", collapsed && "mt-0")}>
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "sidebar-item",
                              collapsed && "justify-center p-2",
                              isActive && "sidebar-item-active"
                            )
                          }
                          title={collapsed ? item.name : ""}
                        >
                          <item.icon
                            className={cn(
                              "sidebar-icon h-5 w-5",
                              collapsed ? "m-0" : "mr-3"
                            )}
                            aria-hidden="true"
                          />
                          {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
