"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-whitish p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Link href="/grant-form">
            <Button variant="outline" className="border-persimmon text-persimmon hover:bg-persimmon hover:text-white">
              Grant Application Form
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-sblack lato-bold">
            Instrumentl Style Guide Demo
          </h1>
          <p className="text-lg text-smoke-300 lato-regular">
            Showcasing the complete color palette, typography, and component styles
          </p>
        </div>

        {/* Brand Colors */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Brand Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Colors */}
            <div>
              <h3 className="text-lg font-semibold text-sblack lato-bold mb-3">Primary Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-persimmon rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Persimmon</p>
                  <p className="text-xs text-smoke-300 lato-light">#FF6F61</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-eggplant rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Eggplant</p>
                  <p className="text-xs text-smoke-300 lato-light">#64447C</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-jazzy rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Jazzy</p>
                  <p className="text-xs text-smoke-300 lato-light">#6F339E</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-twilight rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Twilight</p>
                  <p className="text-xs text-smoke-300 lato-light">#5A56B3</p>
                </div>
              </div>
            </div>

            {/* Accent Colors */}
            <div>
              <h3 className="text-lg font-semibold text-sblack lato-bold mb-3">Accent Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-bubblegum rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Bubblegum</p>
                  <p className="text-xs text-smoke-300 lato-light">#F9A1EB</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-golden rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Golden</p>
                  <p className="text-xs text-smoke-300 lato-light">#FDC05A</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-tomato rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Tomato</p>
                  <p className="text-xs text-smoke-300 lato-light">#D55447</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-lilac-300 rounded-lg border border-silver-200"></div>
                  <p className="text-sm text-sblack lato-regular">Lilac</p>
                  <p className="text-xs text-smoke-300 lato-light">#5D5AB5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Colors */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Status Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-status-researching rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Researching</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-status-planned rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Planned</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-status-awarded rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Awarded</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-status-declined rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Declined</p>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-status-closed rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Typography - Lato Font</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-4xl lato-black text-sblack">Lato Black - 900</h1>
              <h2 className="text-3xl lato-bold text-sblack">Lato Bold - 700</h2>
              <h3 className="text-2xl lato-regular text-sblack">Lato Regular - 400</h3>
              <h4 className="text-xl lato-light text-sblack">Lato Light - 300</h4>
              <p className="text-lg lato-thin text-sblack">Lato Thin - 100</p>
            </div>
            <div className="pt-4 border-t border-silver-200">
              <h3 className="text-lg lato-bold-italic text-sblack mb-2">Italic Variants</h3>
              <p className="lato-regular-italic text-sblack">Lato Regular Italic - 400</p>
              <p className="lato-light-italic text-sblack">Lato Light Italic - 300</p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Button Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-sblack lato-bold mb-3">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" className="bg-persimmon hover:bg-persimmon-500 text-white">
                  Primary Button
                </Button>
                <Button variant="secondary" className="bg-silver-100 hover:bg-silver-200 text-sblack">
                  Secondary Button
                </Button>
                <Button variant="outline" className="border-persimmon text-persimmon hover:bg-persimmon hover:text-white">
                  Outline Button
                </Button>
                <Button variant="ghost" className="text-persimmon hover:bg-persimmon-50">
                  Ghost Button
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-sblack lato-bold mb-3">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm" className="bg-persimmon hover:bg-persimmon-500 text-white">
                  Small
                </Button>
                <Button size="default" className="bg-persimmon hover:bg-persimmon-500 text-white">
                  Default
                </Button>
                <Button size="lg" className="bg-persimmon hover:bg-persimmon-500 text-white">
                  Large
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alert Colors */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Alert Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFD700', color: '#8B4500' }}>
                <h4 className="font-semibold lato-bold mb-1">Attention Light</h4>
                <p className="text-sm lato-regular">For large text and icons</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFA500', color: '#8B4500' }}>
                <h4 className="font-semibold lato-bold mb-1">Attention Regular</h4>
                <p className="text-sm lato-regular">For regular text</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#00A86B', color: '#006B3C' }}>
                <h4 className="font-semibold lato-bold mb-1">Success</h4>
                <p className="text-sm lato-regular">Positive feedback and confirmations</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#CC0000', color: '#B80000' }}>
                <h4 className="font-semibold lato-bold mb-1">Danger</h4>
                <p className="text-sm lato-regular">Errors and critical warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neutral Colors */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Neutral Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-blackish rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Blackish</p>
                <p className="text-xs text-smoke-300 lato-light">#44433D</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-whitish rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Whitish</p>
                <p className="text-xs text-smoke-300 lato-light">#F6F6F5</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-silver rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Silver</p>
                <p className="text-xs text-smoke-300 lato-light">#C5D1D4</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-smoke-300 rounded-lg border border-silver-200"></div>
                <p className="text-sm text-sblack lato-regular">Smoke 300</p>
                <p className="text-xs text-smoke-300 lato-light">#747171</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="bg-white border-silver-200">
          <CardHeader>
            <CardTitle className="text-sblack lato-bold">Badges & Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-recipient text-sblack lato-regular">Recipient</Badge>
              <Badge className="bg-funder text-sblack lato-regular">Funder</Badge>
              <Badge className="bg-pastDue text-sblack lato-regular">Past Due</Badge>
              <Badge className="bg-partialMatch text-sblack lato-regular">Partial Match</Badge>
              <Badge className="bg-exactMatch text-sblack lato-regular">Exact Match</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
