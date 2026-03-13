"use client";

import React, { useState, useEffect, useRef } from "react";
import { submitSchoolQuery } from "./SchoolQueryFormAction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SchoolOption {
  _id: string;
  name: string;
  logo: string;
  address: string;
}

const SchoolQueryForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SchoolOption[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolOption | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (search.trim().length === 0) {
      setResults([]);
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetch(`/api/schools/search?q=${encodeURIComponent(search)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResults(data.results || []);
        }
      })
      .catch((e) => {
        if (e.name !== 'AbortError') console.error(e);
      });
  }, [search]);

  const handleSelect = (school: SchoolOption) => {
    setSelectedSchool(school);
    setSearch(school.name);
    setResults([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSchool) {
      toast.error("Please select a school from the list.");
      return;
    }
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await submitSchoolQuery(formData);
      if (result.success) {
        setSucceeded(true);
        form.reset();
        setSelectedSchool(null);
      } else {
        toast.error(result.error || "Error submitting request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Contact Support</h2>
      {succeeded ? (
        <div className="text-center py-8">
          <p className="text-green-600 dark:text-green-400 text-xl font-semibold mb-2">
            Request Sent Successfully!
          </p>
          <p className="text-muted-foreground">
            Our team will get back to you soon.
          </p>
          <Button
            variant="link"
            onClick={() => setSucceeded(false)}
            className="mt-4"
          >
            Send another request
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2 relative">
            <Label htmlFor="schoolSearch">Search School:</Label>
            <Input
              id="schoolSearch"
              name="schoolSearch"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedSchool(null);
              }}
              autoComplete="off"
              placeholder="Start typing school name..."
              required
            />
            {results.length > 0 && (
              <div className="absolute z-50 w-full bg-card border border-border rounded-md mt-1 max-h-60 overflow-y-auto">
                {results.map((s) => (
                  <button
                    type="button"
                    key={s._id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-muted w-full text-left"
                    onClick={() => handleSelect(s)}
                  >
                    <img
                      src={s.logo}
                      alt={s.name}
                      className="h-8 w-8 object-contain rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedSchool && (
            <input type="hidden" name="schoolId" value={selectedSchool._id} />
          )}

          <div className="space-y-2">
            <Label htmlFor="query">Your Query:</Label>
            <Textarea
              id="query"
              name="query"
              rows={4}
              required
              placeholder="Describe your issue or question"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPersonName">Contact Person (optional):</Label>
            <Input
              id="contactPersonName"
              name="contactPersonName"
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPersonMobile">Contact Mobile (optional):</Label>
            <Input
              id="contactPersonMobile"
              name="contactPersonMobile"
              pattern="[0-9]{10}"
              title="Enter a 10-digit number"
              placeholder="9876543210"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button
              type="reset"
              variant="secondary"
              disabled={submitting}
              className="flex-1"
              onClick={() => setSelectedSchool(null)}
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 shadow-md shadow-blue-200 dark:shadow-blue-900/20"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default SchoolQueryForm;