"use client";

import { Button, Card, Input, Select } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Settings
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Configure your dashboard preferences
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Account
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Organization Name
              </label>
              <Input placeholder="e.g., Acme Corp" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <Input type="email" placeholder="finance@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Timezone
              </label>
              <Select>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>America/Los_Angeles</option>
                <option>Europe/London</option>
                <option>Asia/Tokyo</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Default Currency
              </label>
              <Select>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Date Format
              </label>
              <Select>
                <option>YYYY-MM-DD (ISO 8601)</option>
                <option>MM/DD/YYYY (US)</option>
                <option>DD/MM/YYYY (European)</option>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Email Notifications
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Receive weekly summaries and alerts
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e51c56]/20 dark:peer-focus:ring-[#e51c56]/30 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#e51c56]" />
              </label>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Auto-Sync Transactions
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Automatically fetch new transactions daily
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e51c56]/20 dark:peer-focus:ring-[#e51c56]/30 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#e51c56]" />
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Export Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                CSV Delimiter
              </label>
              <Select>
                <option>Comma (,)</option>
                <option>Semicolon (;)</option>
                <option>Tab (	)</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                ISO 20022 Version
              </label>
              <Select>
                <option>2024 (Latest)</option>
                <option>2022</option>
                <option>2019</option>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Include Flare Anchor Hash
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Add verification hashes to exports
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#e51c56]/20 dark:peer-focus:ring-[#e51c56]/30 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-[#e51c56]" />
              </label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Delete All Transactions
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Permanently remove all synced transaction data
                </div>
              </div>
              <Button variant="outline" size="sm">
                Delete Data
              </Button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Delete Account
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                  Permanently delete your account and all data
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                Delete Account
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">
            Cancel
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
