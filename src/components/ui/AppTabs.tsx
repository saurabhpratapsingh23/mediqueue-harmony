import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { cn } from '@/lib/utils';

export interface AppTabsProps extends React.ComponentProps<typeof Tabs> {
  className?: string;
}

export const AppTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  AppTabsProps
>(({ className, ...props }, ref) => (
  <Tabs
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
AppTabs.displayName = "AppTabs";

export interface AppTabsListProps extends React.ComponentProps<typeof TabsList> {
  className?: string;
}

export const AppTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  AppTabsListProps
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
AppTabsList.displayName = "AppTabsList";

export interface AppTabsTriggerProps extends React.ComponentProps<typeof TabsTrigger> {
  className?: string;
}

export const AppTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  AppTabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
AppTabsTrigger.displayName = "AppTabsTrigger";

export interface AppTabsContentProps extends React.ComponentProps<typeof TabsContent> {
  className?: string;
}

export const AppTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  AppTabsContentProps
>(({ className, ...props }, ref) => (
  <TabsContent
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
AppTabsContent.displayName = "AppTabsContent"; 