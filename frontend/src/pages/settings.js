import React, { useState } from 'react';
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
  Drawer,
  Modal,
} from '../components/common';
import { useForm, useDataTable, useModal } from '../hooks';
import settingsService from '../services/settingsService';
import { extractErrorMessage } from '../utils/errorHandler';
import { APP_CONFIG } from '../utils/constants';

export default function SettingsPage() {
  const { confirm } = useModal();
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState(null);

  // Drawer Inspection State
  const [inspectDrawerOpen, setInspectDrawerOpen] = useState(false);
  const [inspectedSetting, setInspectedSetting] = useState(null);

  // Advanced Search Modal State
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');

  // Column definitions for the Data Table
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
      render: (val) => <span className="text-truncate d-inline-block" style={{ maxWidth: '180px' }}>{val}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => <Badge variant="secondary">{val}</Badge>,
    },
    {
      key: 'value_type',
      label: 'Type',
      render: (val) => <Badge variant="light" className="border text-dark">{val}</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setInspectedSetting(row);
            setInspectDrawerOpen(true);
          }}
          title="Inspect in Drawer"
        >
          👁️ Inspect
        </Button>
      ),
    },
  ];

  // Data Table State Management via useDataTable
  const table = useDataTable({
    fetchFn: settingsService.listSettings,
    initialPageSize: 10,
    columns: columns,
    rowKey: 'id',
    exportFilename: 'system_settings_export',
  });

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
        table.refetch();
      } catch (err) {
        setSaveErrorMsg(extractErrorMessage(err));
        throw err;
      }
    },
  });

  // Handle Form Reset with Confirmation Dialog
  const handleResetWithConfirm = () => {
    if (!form.isDirty) {
      form.resetForm();
      return;
    }
    confirm({
      title: 'Reset Configuration Form?',
      message: 'You have unsaved form changes. Are you sure you want to discard your edits?',
      confirmText: 'Discard Changes',
      confirmVariant: 'warning',
      onConfirm: () => {
        form.resetForm();
      },
    });
  };

  // Populate form for editing on row click
  const handleEditRow = (row) => {
    form.setValues({
      setting_key: row.setting_key,
      setting_value: row.setting_value,
      value_type: row.value_type || 'string',
      category: row.category || 'SYSTEM',
      description: row.description || '',
    });
    setSaveSuccessMsg(`Loaded '${row.setting_key}' into editor.`);
  };

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
        badge={<Badge variant="primary" pill>Modal & Drawer System</Badge>}
        actions={
          <Button
            variant="outline-secondary"
            size="sm"
            startIcon={<span>🔍</span>}
            onClick={() => setSearchModalOpen(true)}
          >
            Advanced Filter Modal
          </Button>
        }
      />

      <div className="row g-4">
        {/* Left Column: Form Component System */}
        <div className="col-xl-4 col-lg-5">
          <FormSection
            title="Create / Edit Parameter"
            subtitle="Add or update configuration keys"
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
                helperText="Unique parameter identifier"
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
                  onClick={handleResetWithConfirm}
                  disabled={form.isSubmitting}
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

        {/* Right Column: Advanced Data Table System */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow-sm border p-4">
            <h6 className="fw-bold text-dark mb-3">Enterprise Configuration Data Table</h6>

            <DataTable
              columns={table.visibleColumns}
              data={table.data}
              loading={table.loading}
              emptyMessage="No system configuration parameters found."
              sortBy={table.sortBy}
              sortOrder={table.sortOrder}
              onSort={table.handleSort}
              selectable
              selectedIds={table.selectedIds}
              onSelectRow={table.handleSelectRow}
              onSelectAll={table.handleSelectAll}
              onRowClick={handleEditRow}
              pagination={{
                page: table.pagination.page,
                pageSize: table.pagination.pageSize,
                totalRecords: table.pagination.totalRecords,
                totalPages: table.pagination.totalPages,
                onPageChange: table.pagination.setPage,
                onPageSizeChange: table.pagination.setPageSize,
              }}
              toolbar={{
                search: table.search,
                onSearchChange: table.setSearch,
                searchPlaceholder: 'Search keys or values...',
                hiddenColumnKeys: table.hiddenColumnKeys,
                onToggleColumnVisibility: table.toggleColumnVisibility,
                onExportCsv: () => table.exportCsv('settings_export.csv'),
                onExportJson: () => table.exportJson('settings_export.json'),
                onRefresh: table.refetch,
                onClearSelection: table.clearSelection,
                bulkActions: (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => table.exportCsv('selected_settings.csv')}
                  >
                    Export Selected CSV
                  </Button>
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Slide-Out Detail Inspection Drawer */}
      <Drawer
        isOpen={inspectDrawerOpen}
        onClose={() => setInspectDrawerOpen(false)}
        title="Parameter Inspection"
        subtitle={inspectedSetting?.setting_key}
        icon="🔍"
        size="md"
        footer={
          <div className="d-flex justify-content-between align-items-center w-100">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                if (inspectedSetting) {
                  handleEditRow(inspectedSetting);
                  setInspectDrawerOpen(false);
                }
              }}
            >
              Load in Editor ✏️
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setInspectDrawerOpen(false)}>
              Close Drawer
            </Button>
          </div>
        }
      >
        {inspectedSetting && (
          <div className="d-flex flex-column gap-3">
            <div className="p-3 bg-light-subtle rounded border">
              <div className="text-secondary small fw-medium text-uppercase mb-1">Configuration Key</div>
              <div className="font-monospace fw-bold fs-5 text-primary">{inspectedSetting.setting_key}</div>
            </div>

            <div className="row g-2">
              <div className="col-6">
                <div className="p-3 border rounded">
                  <div className="text-muted small">Category</div>
                  <div className="fw-semibold mt-1">
                    <Badge variant="secondary">{inspectedSetting.category}</Badge>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 border rounded">
                  <div className="text-muted small">Value Type</div>
                  <div className="fw-semibold mt-1">
                    <Badge variant="light" className="border text-dark">{inspectedSetting.value_type}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded">
              <div className="text-muted small mb-1">Configured Value</div>
              <div className="p-2 bg-body-tertiary rounded font-monospace small border">
                {inspectedSetting.setting_value}
              </div>
            </div>

            <div className="p-3 border rounded">
              <div className="text-muted small mb-1">Description</div>
              <div className="text-dark small">{inspectedSetting.description || 'No description provided.'}</div>
            </div>

            <div className="p-3 border rounded bg-body-tertiary">
              <div className="text-muted small mb-2 fw-semibold">Audit & Multi-Tenant Metadata</div>
              <div className="d-flex flex-column gap-1 small text-secondary">
                <div>Tenant Scope: <strong>{inspectedSetting.tenant_id || 'System Global'}</strong></div>
                <div>Record ID: <code>{inspectedSetting.id}</code></div>
                <div>Created At: {inspectedSetting.created_at || 'Preloaded'}</div>
                <div>Last Updated: {inspectedSetting.updated_at || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Advanced Search Modal */}
      <Modal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        title="Advanced Parameter Filter"
        subtitle="Filter system settings by category and type"
        icon="🔍"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => {
                setSearchCategory('');
                table.setFilters({});
                setSearchModalOpen(false);
              }}
            >
              Clear Filters
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                table.setFilters({ category: searchCategory || undefined });
                setSearchModalOpen(false);
              }}
            >
              Apply Filter
            </Button>
          </div>
        }
      >
        <div className="p-2">
          <SelectField
            label="Filter by Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              { value: 'SYSTEM', label: 'SYSTEM' },
              { value: 'FINANCE', label: 'FINANCE' },
              { value: 'INVENTORY', label: 'INVENTORY' },
              { value: 'MANUFACTURING', label: 'MANUFACTURING' },
            ]}
            helperText="Narrow down results to a specific functional category"
          />
        </div>
      </Modal>
    </Layout>
  );
}
