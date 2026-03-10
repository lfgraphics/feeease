export const SCHOOL_FEATURES = [
    { id: "whatsapp", label: "WhatsApp Automation", description: "Automated notifications via WhatsApp" },
    { id: "teachersLogin", label: "Teachers Login", description: "Portal access for teachers" },
    { id: "parentsLogin", label: "Parents Login", description: "Portal access for parents" },
    { id: "teacherAttendance", label: "Teacher Attendance", description: "Track teacher attendance" },
    { id: "payroll", label: "Payroll", description: "Manage staff payroll and salaries" },
    // Add new features here
  ] as const;
  
  export type SchoolFeatureId = typeof SCHOOL_FEATURES[number]["id"];
  
  export const DEFAULT_FEATURES: Record<SchoolFeatureId, boolean> = SCHOOL_FEATURES.reduce((acc, feature) => {
    acc[feature.id] = false;
    return acc;
  }, {} as Record<SchoolFeatureId, boolean>);
