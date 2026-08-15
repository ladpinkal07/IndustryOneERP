import { useState, useCallback } from 'react';

/**
 * Enterprise Form Management Hook
 * Supports validation rules, dirty checking, touch tracking, and async submit handling.
 *
 * Validation rule structure:
 * {
 *   fieldName: {
 *     required: true | 'Custom required message',
 *     min: 0,
 *     max: 100,
 *     minLength: 3,
 *     maxLength: 50,
 *     pattern: /^[A-Z0-9_-]+$/ | { regex: /.../, message: '...' },
 *     validate: (value, formValues) => true | 'Error message'
 *   }
 * }
 */
export function useForm({ initialValues = {}, validationRules = {}, onSubmit } = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (name, value, currentValues = values) => {
      const rules = validationRules[name];
      if (!rules) return null;

      // Required check
      if (rules.required) {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          return typeof rules.required === 'string' ? rules.required : 'This field is required.';
        }
      }

      // If value is empty and not required, skip further checks
      if (value === '' || value === null || value === undefined) {
        return null;
      }

      // Min length check
      if (rules.minLength && String(value).length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters.`;
      }

      // Max length check
      if (rules.maxLength && String(value).length > rules.maxLength) {
        return `Must be at most ${rules.maxLength} characters.`;
      }

      // Min numeric check
      if (rules.min !== undefined && Number(value) < rules.min) {
        return `Must be at least ${rules.min}.`;
      }

      // Max numeric check
      if (rules.max !== undefined && Number(value) > rules.max) {
        return `Must be at most ${rules.max}.`;
      }

      // Regex pattern check
      if (rules.pattern) {
        const regex = rules.pattern.regex || rules.pattern;
        const msg = rules.pattern.message || 'Invalid format.';
        if (!regex.test(String(value))) {
          return msg;
        }
      }

      // Custom validator function
      if (rules.validate && typeof rules.validate === 'function') {
        const result = rules.validate(value, currentValues);
        if (result !== true && typeof result === 'string') {
          return result;
        }
      }

      return null;
    },
    [validationRules, values]
  );

  // Validate all fields
  const validateAll = useCallback(
    (currentValues = values) => {
      const newErrors = {};
      let isValid = true;

      Object.keys(validationRules).forEach((name) => {
        const error = validateField(name, currentValues[name], currentValues);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return { isValid, errors: newErrors };
    },
    [validationRules, validateField, values]
  );

  // Field change handler
  const handleChange = useCallback(
    (eOrName, directValue) => {
      let name;
      let value;

      if (eOrName && eOrName.target) {
        name = eOrName.target.name;
        const target = eOrName.target;
        value = target.type === 'checkbox' ? target.checked : target.value;
      } else {
        name = eOrName;
        value = directValue;
      }

      setValues((prev) => {
        const next = { ...prev, [name]: value };
        setIsDirty(true);

        // Revalidate if touched
        if (touched[name]) {
          const error = validateField(name, value, next);
          setErrors((errPrev) => ({ ...errPrev, [name]: error }));
        }

        return next;
      });
    },
    [touched, validateField]
  );

  // Field blur handler
  const handleBlur = useCallback(
    (eOrName) => {
      const name = eOrName && eOrName.target ? eOrName.target.name : eOrName;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, values[name], values);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  // Form submit handler
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Mark all validated fields as touched
      const allTouched = {};
      Object.keys(validationRules).forEach((k) => {
        allTouched[k] = true;
      });
      setTouched(allTouched);

      const { isValid, errors: currentErrors } = validateAll(values);
      if (!isValid) {
        return { success: false, errors: currentErrors };
      }

      if (!onSubmit) {
        return { success: true, values };
      }

      setIsSubmitting(true);
      try {
        const result = await onSubmit(values);
        setIsDirty(false);
        return { success: true, result };
      } catch (err) {
        return { success: false, error: err };
      } finally {
        setIsSubmitting(false);
      }
    },
    [validationRules, validateAll, values, onSubmit]
  );

  // Reset form
  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
      setTouched({});
      setIsDirty(false);
      setIsSubmitting(false);
    },
    [initialValues]
  );

  // Set field value directly
  const setFieldValue = useCallback(
    (name, value) => {
      handleChange(name, value);
    },
    [handleChange]
  );

  // Set field error directly (e.g. from backend response envelope)
  const setFieldError = useCallback((name, errorMsg) => {
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
    validateAll,
  };
}
