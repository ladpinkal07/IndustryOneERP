import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import PageHeader from '../components/layout/PageHeader';
import {
  FormSection,
  FormGrid,
  InputField,
  SelectField,
  TextareaField,
  Button,
  Alert,
  Badge,
  DataTable,
  Pagination,
  SearchInput,
} from '../components/common';
import { useForm, usePagination, useDebounce } from '../hooks';
import settingsService from '../services/settingsService';
import { extractErrorMessage } from '../utils/errorHandler';
import { APP_CONFIG } from '../utils/constants';

export default function SettingsPage() {
  const [settingsList, setSettingsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const pagination = usePagination(1, 10);

  // Form Management with useForm
  const form = useForm({
    initialValues: {
      setting_key: '',
      setting_value: '',
      value_type: 'string',
      category: 'SYSTEM',
      description: '',
    },
    validationRules: {
      setting_key: {
        required: 'Configuration key is required.',
        minLength: 3,
        pattern: {
          regex: /^[a-z0-9_.-]+$/i,
          message: 'Key can only contain alphanumeric characters, dots, hyphens, and underscores.',
        },
      },
      setting_value: {
        required: 'Configuration value is required.',
      },
      category: {
        required: 'Category is required.',
      },
    },
    onSubmit: async (values) => {
      setSaveSuccessMsg(null);
      setSaveErrorMsg(null);
      try {
        await settingsService.saveSetting(values);
        setSaveSuccessMsg(`Configuration '${values.setting_key}' saved successfully!`);
        form.resetForm();
        fetchSettings();
      } catch (err) {
        setSaveErrorMsg(extractErrorMessage(err));
        throw err;
      }
    },
  });

  // Fetch paginated and filtered settings
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsService.listSettings({
        page: pagination.page,
        page_size: pagination.pageSize,
        search: debouncedSearch || undefined,
      });

      if (response && response.data) {
        setSettingsList(response.data);
        if (response.meta) {
          pagination.setPaginationMeta(response.meta);
        }
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [pagination.page, pagination.pageSize, debouncedSearch]);

  const columns = [
    {
      key: 'setting_key',
      label: 'Setting Key',
      sortable: true,
      render: (val) => <span className="font-monospace fw-semibold text-primary">{val}</span>,
    },
    {
      key: 'setting_value',
      label: 'Value',
      render: (val) => <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>{val}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => <Badge variant="secondary">{val}</Badge>,
    },
    {
      key: 'value_type',
      label: 'Type',
      render: (val) => <Badge variant="light" className="border text-dark">{val}</Badge>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (val) => <span className="text-muted small">{val || '-'}</span>,
    },
  ];

  return (
    <Layout>
      <Head>
        <title>System Settings | {APP_CONFIG.NAME}</title>
        <meta name="description" content="Manage ERP system configurations and tenant settings" />
      </Head>

      <PageHeader
        title="System Settings"
        subtitle="Manage dynamic multi-tenant configuration parameters, defaults, and feature flags."
        icon="⚙️"
        badge={<Badge variant="primary" pill>Active Config</Badge>}
      />

      <div className="row g-4">
        {/* Left Column: Form Component System in Action */}
        <div className="col-lg-5">
          <FormSection
            title="Create / Update Parameter"
            subtitle="Add or modify multi-tenant key-value configurations"
            icon="📝"
          >
            {saveSuccessMsg && (
              <Alert variant="success" dismissible onDismiss={() => setSaveSuccessMsg(null)}>
                {saveSuccessMsg}
              </Alert>
            )}

            {saveErrorMsg && (
              <Alert variant="danger" dismissible onDismiss={() => setSaveErrorMsg(null)}>
                {saveErrorMsg}
              </Alert>
            )}

            <form onSubmit={form.handleSubmit} noValidate>
              <InputField
                label="Configuration Key"
                name="setting_key"
                value={form.values.setting_key}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="e.g. app.tax_rate"
                required
                error={form.touched.setting_key && form.errors.setting_key}
                helperText="Unique identifier key in lower-case format"
              />

              <FormGrid cols={2}>
                <SelectField
                  label="Category"
                  name="category"
                  value={form.values.category}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  options={[
                    { value: 'SYSTEM', label: 'SYSTEM' },
                    { value: 'FINANCE', label: 'FINANCE' },
                    { value: 'INVENTORY', label: 'INVENTORY' },
                    { value: 'MANUFACTURING', label: 'MANUFACTURING' },
                  ]}
                  error={form.touched.category && form.errors.category}
                />

                <SelectField
                  label="Value Type"
                  name="value_type"
                  value={form.values.value_type}
                  onChange={form.handleChange}
                  options={[
                    { value: 'string', label: 'String' },
                    { value: 'int', label: 'Integer' },
                    { value: 'float', label: 'Float' },
                    { value: 'bool', label: 'Boolean' },
                  ]}
                />
              </FormGrid>

              <InputField
                label="Configuration Value"
                name="setting_value"
                value={form.values.setting_value}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                placeholder="e.g. 0.18"
                required
                error={form.touched.setting_value && form.errors.setting_value}
              />

              <TextareaField
                label="Description"
                name="description"
                value={form.values.description}
                onChange={form.handleChange}
                placeholder="Brief purpose of this configuration parameter..."
                rows={3}
                maxLength={200}
              />

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  type="button"
                  onClick={() => form.resetForm()}
                  disabled={!form.isDirty || form.isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  loading={form.isSubmitting}
                  startIcon={<span>💾</span>}
                >
                  Save Parameter
                </Button>
              </div>
            </form>
          </FormSection>
        </div>

        {/* Right Column: Settings Data Grid with Search & Pagination */}
        <div className="col-lg-7">
          <div className="card shadow-sm border p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
              <h6 className="fw-bold text-dark mb-0">Active Configuration Parameters</h6>
              <div style={{ maxWidth: '240px' }}>
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Filter keys or values..."
                />
              </div>
            </div>

            <DataTable
              columns={columns}
              data={settingsList}
              loading={loading}
              emptyMessage="No system configuration parameters found."
            />

            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              totalRecords={pagination.totalRecords}
              totalPages={pagination.totalPages}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
