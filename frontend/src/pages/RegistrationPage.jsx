import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const sriLankaDistricts = [
  "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya",
  "Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar",
  "Mullaitivu","Vavuniya","Puttalam","Kurunegala","Anuradhapura",
  "Polonnaruwa","Badulla","Monaragala","Ratnapura","Kegalle",
  "Trincomalee","Batticaloa","Ampara",
];

const InputError = ({ msg }) =>
  msg ? <p className="text-red-500 text-xs mt-1">⚠ {msg}</p> : null;

export default function RegistrationPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", email: "", phoneNumber: "",
    password: "", confirmPassword: "",
    educationLevel: "al", ageGroup: "16-18",
    schoolName: "", district: "", agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter a valid email address";
    if (!formData.phoneNumber.trim()) e.phoneNumber = "Phone number is required";
    else if (!/^(\+94|0)?[0-9]{9,10}$/.test(formData.phoneNumber.replace(/\s/g, "")))
      e.phoneNumber = "Enter a valid Sri Lankan phone number";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "At least 8 characters";
    else if (formData.password.length > 12) e.password = "At most 12 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "Must include uppercase, lowercase, and number";
    if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!formData.agreeToTerms) e.agreeToTerms = "You must agree to the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // TODO: replace with authApi.register(formData)
    setTimeout(() => {
      setSubmitting(false);
      navigate("/login");
    }, 1200);
  };

  const inputCls = (hasErr) =>
    `w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm ${
      hasErr ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300"
    }`;

  const selectCls =
    "w-full pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 transition-all appearance-none bg-white cursor-pointer text-sm";

  const EyeOpen = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOff = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const ChevronDown = () => (
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  const FieldIcon = ({ children }) => (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-4 shadow-xl">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Create Your Account</h1>
          <p className="text-indigo-100">Join Empathy for Learning today</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">

          {/* Step indicator 
          <div className="flex items-center gap-2 mb-7">
            <div className="h-1.5 flex-1 rounded-full bg-indigo-500" />
            <div className="h-1.5 flex-1 rounded-full bg-indigo-300" />
            <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
            <span className="text-xs text-gray-400 ml-1">Step 1 of 3</span>
          </div>*/}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FieldIcon>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </FieldIcon>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  placeholder="Enter your full name" className={inputCls(errors.fullName)} />
              </div>
              <InputError msg={errors.fullName} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FieldIcon>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </FieldIcon>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="your.email@example.com" className={inputCls(errors.email)} />
              </div>
              <InputError msg={errors.email} />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FieldIcon>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </FieldIcon>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                  placeholder="+94 71 234 5678" className={inputCls(errors.phoneNumber)} />
              </div>
              <InputError msg={errors.phoneNumber} />
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FieldIcon>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </FieldIcon>
                  <input type={showPw ? "text" : "password"} name="password"
                    value={formData.password} onChange={handleChange} placeholder="8-12 characters"
                    className={`${inputCls(errors.password)} pr-12`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                <InputError msg={errors.password} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FieldIcon>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </FieldIcon>
                  <input type={showCpw ? "text" : "password"} name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password"
                    className={`${inputCls(errors.confirmPassword)} pr-12`} />
                  <button type="button" onClick={() => setShowCpw(!showCpw)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showCpw ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                <InputError msg={errors.confirmPassword} />
              </div>
            </div>

            {/* Education + Age */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Education Level <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FieldIcon>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </FieldIcon>
                  <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className={selectCls}>
                    <option value="al">GCE A/L Student</option>
                    <option value="university">1st Year University Student</option>
                    <option value="university">Other</option>
                  </select>
                  <ChevronDown />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age Group <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FieldIcon>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </FieldIcon>
                  <select name="ageGroup" value={formData.ageGroup} onChange={handleChange} className={selectCls}>
                    <option value="Below16">Below 16 years</option>
                    <option value="16-18">16–18 years</option>
                    <option value="19-21">19–21 years</option>
                    <option value="22-25">22-25 years</option>
                    <option value="26+">26+ years</option>
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* School + District */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  School / University
                  <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <FieldIcon>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </FieldIcon>
                  <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange}
                    placeholder="e.g. University of Colombo"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 transition-all text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  District
                  <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                </label>
                <div className="relative">
                  <FieldIcon>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </FieldIcon>
                  <select name="district" value={formData.district} onChange={handleChange} className={selectCls}>
                    <option value="">Select district</option>
                    {sriLankaDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className={`rounded-xl p-4 border-2 transition-colors ${
              errors.agreeToTerms ? "border-red-300 bg-red-50" : "border-indigo-100 bg-indigo-50/50"
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-0.5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer shrink-0" />
                <span className="text-sm text-gray-700 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 underline font-semibold">Privacy Policy</a>
                  {" "}and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800 underline font-semibold">Terms of Service</a>
                  {" "}<span className="text-red-500">*</span>
                </span>
              </label>
              <InputError msg={errors.agreeToTerms} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-7 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-3">Already have an account?</p>
            <Link to="/login"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}