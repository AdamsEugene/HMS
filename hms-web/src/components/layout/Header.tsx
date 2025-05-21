import { useState, Fragment } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  SwatchIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import { cn } from "../../utils/cn";
import { Menu, Transition, Popover } from "@headlessui/react";
import { useTheme } from "../../contexts/ThemeContext";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumbs?: { name: string; href: string }[];
  showSearch?: boolean;
  showDateInfo?: boolean;
  showNotifications?: boolean;
  onSearch?: (query: string) => void;
  themeColor?: string;
  organizationName?: string;
  organizationLogo?: string;
  organizationTagline?: string;
}

const userNavigation = [
  { name: "Your Profile", href: "#profile", icon: UserIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
  { name: "Sign out", href: "#signout", icon: ArrowRightOnRectangleIcon },
];

// Sample notifications for demo
const notifications = [
  {
    id: 1,
    title: "New patient admission",
    description: "Patient John Doe was admitted to ER",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Lab results ready",
    description: "Lab results for patient Jane Smith are ready",
    time: "30 min ago",
    unread: true,
  },
  {
    id: 3,
    title: "Meeting scheduled",
    description: "Staff meeting at 2:00 PM in Conference Room A",
    time: "2 hours ago",
    unread: false,
  },
  {
    id: 4,
    title: "System update",
    description: "The system will be updated tonight at 2:00 AM",
    time: "5 hours ago",
    unread: false,
  },
];

// Available organizations for demo
const organizations = [
  {
    id: 1,
    name: "General Hospital",
    logo: "https://placehold.co/100x40/3B82F6/FFFFFF?text=GH",
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Children's Medical Center",
    logo: "https://placehold.co/100x40/10B981/FFFFFF?text=CMC",
    color: "#10B981",
  },
  {
    id: 3,
    name: "University Health System",
    logo: "https://placehold.co/100x40/8B5CF6/FFFFFF?text=UHS",
    color: "#8B5CF6",
  },
];

const Header = ({
  setSidebarOpen,
  title,
  subtitle,
  actions,
  breadcrumbs,
  showSearch = true,
  showDateInfo = true,
  showNotifications = true,
  onSearch,
  organizationName = "MediHub Central",
  organizationLogo = "https://placehold.co/100x40/3B82F6/FFFFFF?text=MediHub",
  // organizationTagline,
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter((n) => n.unread).length
  );
  const [selectedOrg, setSelectedOrg] = useState(organizations[0]);

  // Use theme hook instead of local state
  const { currentTheme, setTheme, availableThemes } = useTheme();

  // Get current date and time
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // If no breadcrumbs provided, attempt to generate from current path
  const defaultBreadcrumbs = !breadcrumbs
    ? location.pathname
        .split("/")
        .filter(Boolean)
        .map((segment, index, arr) => ({
          name:
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " "),
          href: "/" + arr.slice(0, index + 1).join("/"),
        }))
    : undefined;

  const displayBreadcrumbs = breadcrumbs || defaultBreadcrumbs || [];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  // Handle marking all notifications as read
  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  // Apply theme using hook
  const applyTheme = (theme: (typeof availableThemes)[0]) => {
    setTheme(theme);
  };

  // Change organization
  const changeOrganization = (org: (typeof organizations)[0]) => {
    setSelectedOrg(org);
    // In a real application, this would trigger loading organization-specific settings
  };

  return (
    <header className="shadow-sm !z-[50] header-container">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button, Organization Logo, Title & Breadcrumbs */}
          <div className="flex items-center">
            <button
              type="button"
              className="header-menu-button focus:outline-none lg:hidden mr-4"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Organization Logo */}
            <div className="mr-4 flex-shrink-0">
              <img
                src={selectedOrg.logo || organizationLogo}
                alt={selectedOrg.name || organizationName}
                className="h-8 w-auto"
              />
            </div>

            <div className="flex flex-col">
              {/* Organization name and tagline */}
              <div className="">
                <h1 className="text-lg font-semibold header-title">
                  {selectedOrg.name || organizationName}
                </h1>
                {/* {organizationTagline && (
                  <p className="text-xs header-subtitle italic">
                    {organizationTagline}
                  </p>
                )} */}
              </div>

              {/* Title area - Only show when no breadcrumbs */}
              {(title || subtitle) && displayBreadcrumbs.length === 0 && (
                <div className="">
                  {title && (
                    <h2 className="text-lg font-semibold header-title">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm header-subtitle">{subtitle}</p>
                  )}
                </div>
              )}

              {/* Breadcrumbs */}
              {displayBreadcrumbs.length > 0 && (
                <nav className="flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-1 text-sm">
                    <li>
                      <Link to="/" className="header-breadcrumb-link">
                        Home
                      </Link>
                    </li>
                    {displayBreadcrumbs.map((crumb, index) => (
                      <li key={crumb.href}>
                        <div className="flex items-center">
                          <ChevronRightIcon
                            className="h-4 w-4 header-breadcrumb-divider"
                            aria-hidden="true"
                          />
                          <Link
                            to={crumb.href}
                            className={cn(
                              "ml-1",
                              index === displayBreadcrumbs.length - 1
                                ? "header-breadcrumb-current"
                                : "header-breadcrumb-link"
                            )}
                            aria-current={
                              index === displayBreadcrumbs.length - 1
                                ? "page"
                                : undefined
                            }
                          >
                            {crumb.name}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          </div>

          {/* Center - Search */}
          {showSearch && (
            <div className="hidden md:flex max-w-lg w-full mx-4">
              <div className="relative w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative header-search-container">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MagnifyingGlassIcon
                      className="h-5 w-5 header-icon"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="header-search-input"
                    placeholder="Search (patients, doctors, departments...)"
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right side - Actions, Organization Selector, Theme, Help, Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Custom page actions */}
            {actions && <div className="hidden md:flex">{actions}</div>}

            {/* Date and Time Info */}
            {showDateInfo && (
              <div className="hidden lg:flex items-center text-sm header-date">
                <CalendarIcon className="h-5 w-5 mr-1 header-icon" />
                <span>{formattedDate}</span>
              </div>
            )}

            {/* Organization Selector */}
            <Popover className="relative">
              <Popover.Button className="header-icon-button">
                <span className="sr-only">Change organization</span>
                <BuildingOffice2Icon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-50 mt-3 w-screen max-w-xs transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative header-popover-content">
                      <div className="flex items-center">
                        <BuildingOffice2Icon className="h-6 w-6 header-popover-icon" />
                        <h3 className="ml-2 text-base font-medium header-popover-title">
                          Select Organization
                        </h3>
                      </div>
                      <div className="mt-3 space-y-1">
                        {organizations.map((org) => (
                          <button
                            key={org.id}
                            onClick={() => changeOrganization(org)}
                            className={cn(
                              "flex items-center w-full text-left rounded-md py-2 px-3 text-sm header-popover-item",
                              selectedOrg.id === org.id
                                ? "header-popover-item-active"
                                : ""
                            )}
                          >
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: org.color }}
                            />
                            <img
                              src={org.logo}
                              alt={org.name}
                              className="h-5 w-auto mr-2"
                            />
                            {org.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            {/* Theme Selector */}
            <Popover className="relative">
              <Popover.Button className="header-icon-button">
                <span className="sr-only">Change theme</span>
                <SwatchIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-50 mt-3 w-screen max-w-xs transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative header-popover-content">
                      <div className="flex items-center">
                        <SwatchIcon className="h-6 w-6 header-popover-icon" />
                        <h3 className="ml-2 text-base font-medium header-popover-title">
                          Select Theme
                        </h3>
                      </div>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {availableThemes.map((theme) => (
                          <button
                            key={theme.name}
                            onClick={() => applyTheme(theme)}
                            className={cn(
                              "theme-selector-btn flex flex-col items-center justify-center p-2 rounded",
                              currentTheme.name === theme.name
                                ? "theme-selector-btn-active"
                                : ""
                            )}
                            title={theme.name}
                          >
                            <div
                              className="w-10 h-10 rounded-full theme-color-swatch"
                              style={{ backgroundColor: theme.color }}
                            />
                            <span className="text-xs theme-name mt-1 truncate w-full text-center">
                              {theme.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            {/* Help button */}
            <Popover className="relative">
              <Popover.Button className="header-icon-button">
                <span className="sr-only">Get help</span>
                <QuestionMarkCircleIcon
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 z-50 mt-3 w-screen max-w-xs transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative header-popover-content">
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-6 w-6 header-popover-icon" />
                        <h3 className="ml-2 text-base font-medium header-popover-title">
                          Help & Resources
                        </h3>
                      </div>
                      <div className="mt-3 space-y-1">
                        <a
                          href="#documentation"
                          className="header-popover-item block rounded-md py-2 px-3 text-sm"
                        >
                          Documentation
                        </a>
                        <a
                          href="#training"
                          className="header-popover-item block rounded-md py-2 px-3 text-sm"
                        >
                          Training Videos
                        </a>
                        <a
                          href="#support"
                          className="header-popover-item block rounded-md py-2 px-3 text-sm"
                        >
                          Contact Support
                        </a>
                        <a
                          href="#shortcuts"
                          className="header-popover-item block rounded-md py-2 px-3 text-sm"
                        >
                          Keyboard Shortcuts
                        </a>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>

            {/* Notifications */}
            {showNotifications && (
              <Popover className="relative">
                <Popover.Button className="header-icon-button relative">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full notification-badge flex items-center justify-center text-xs">
                      {unreadCount}
                    </span>
                  )}
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-50 mt-3 w-screen max-w-xs transform">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative header-popover-content">
                        <div className="flex items-center justify-between p-4 notification-header">
                          <h3 className="text-base font-medium header-popover-title">
                            Notifications
                          </h3>
                          <button
                            onClick={markAllAsRead}
                            className="text-xs notification-action font-medium"
                          >
                            Mark all as read
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <p className="p-4 text-center text-sm notification-empty">
                              No notifications
                            </p>
                          ) : (
                            <div className="notification-list">
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={cn(
                                    "p-4 notification-item cursor-pointer",
                                    notification.unread
                                      ? "notification-unread"
                                      : ""
                                  )}
                                >
                                  <div className="flex items-start">
                                    <div
                                      className={cn(
                                        "h-2 w-2 mt-1.5 mr-2 rounded-full flex-shrink-0 notification-indicator",
                                        notification.unread
                                          ? "notification-indicator-unread"
                                          : "notification-indicator-read"
                                      )}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium notification-title">
                                        {notification.title}
                                      </p>
                                      <p className="text-sm notification-description mt-0.5">
                                        {notification.description}
                                      </p>
                                      <p className="text-xs notification-time mt-1">
                                        {notification.time}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="p-2 notification-footer">
                          <a
                            href="#view-all"
                            className="block w-full px-4 py-2 text-center text-sm font-medium notification-view-all rounded-md"
                          >
                            View all notifications
                          </a>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            )}

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="header-profile-button flex items-center rounded-full">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                  <div className="hidden md:flex flex-col ml-2 text-left">
                    <span className="text-sm font-medium profile-name">
                      Dr. John Smith
                    </span>
                    <span className="text-xs profile-role">Cardiologist</span>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="header-profile-menu absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md shadow-lg focus:outline-none">
                  <div className="py-1 profile-header">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium profile-name">
                        Dr. John Smith
                      </p>
                      <p className="text-xs profile-email">
                        john.smith@hospital.com
                      </p>
                    </div>
                  </div>
                  <div className="py-1">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={cn(
                              active ? "profile-menu-item-active" : "",
                              "flex items-center px-4 py-2 text-sm profile-menu-item"
                            )}
                          >
                            <item.icon
                              className="mr-3 h-5 w-5 profile-menu-icon"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile search - only shown on small screens */}
      {showSearch && (
        <div className="md:hidden px-4 sm:px-6 lg:px-8 pb-4">
          <div className="relative w-full">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <div className="relative header-search-container">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                <MagnifyingGlassIcon
                  className="h-5 w-5 header-icon"
                  aria-hidden="true"
                />
              </div>
              <input
                id="mobile-search"
                name="mobile-search"
                className="header-search-input"
                placeholder="Search"
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
