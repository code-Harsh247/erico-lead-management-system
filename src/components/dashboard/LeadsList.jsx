import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function LeadsList({ 
  leads, 
  loading, 
  pagination, 
  filters, 
  onPageChange, 
  onFilterChange, 
  onEdit, 
  onDelete 
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusFilter = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleSourceFilter = (e) => {
    onFilterChange({ ...filters, source: e.target.value });
  };

  const handleScoreFilter = (e) => {
    onFilterChange({ ...filters, scoreRange: e.target.value });
  };

  const handleValueFilter = (e) => {
    onFilterChange({ ...filters, valueRange: e.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      status: '',
      source: '',
      scoreRange: '',
      valueRange: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.source) count++;
    if (filters.scoreRange) count++;
    if (filters.valueRange) count++;
    return count;
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'new': 'bg-blue-100 text-blue-800 border border-blue-200',
      'contacted': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'qualified': 'bg-green-100 text-green-800 border border-green-200',
      'lost': 'bg-red-100 text-red-800 border border-red-200',
      'won': 'bg-purple-100 text-purple-800 border border-purple-200'
    };

    const statusLabels = {
      'new': 'New',
      'contacted': 'Contacted',
      'qualified': 'Qualified',
      'lost': 'Lost',
      'won': 'Won'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getSourceLabel = (source) => {
    const sourceLabels = {
      'website': 'Website',
      'facebook_ads': 'Facebook Ads',
      'google_ads': 'Google Ads',
      'referral': 'Referral',
      'events': 'Events',
      'other': 'Other'
    };
    return sourceLabels[source] || source;
  };

  const getScoreBadge = (score) => {
    if (!score) return <span className="text-gray-400 text-xs font-medium">-</span>;
    
    let colorClass = 'bg-gray-200 text-gray-800';
    if (score >= 80) colorClass = 'bg-green-500 text-white';
    else if (score >= 60) colorClass = 'bg-yellow-500 text-white';
    else if (score >= 40) colorClass = 'bg-orange-500 text-white';
    else colorClass = 'bg-red-500 text-white';

    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${colorClass}`}>
        {score}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200">
      {/* Header with Filters */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-bold text-black">Leads</h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                  showAdvancedFilters || getActiveFilterCount() > 0
                    ? 'border-black text-white'
                    : 'border-gray-300 text-black bg-white hover:bg-gray-100'
                }`}
                style={showAdvancedFilters || getActiveFilterCount() > 0 ? { backgroundColor: '#101720', borderColor: '#101720' } : {}}
              >
                <Filter className="w-4 h-4 mr-1" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="ml-1 bg-white text-black text-xs rounded-full px-1.5 py-0.5 font-medium">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
              
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm w-64 font-medium transition-colors"
                style={{ 
                  '&:focus': { 
                    outline: 'none', 
                    borderColor: '#101720',
                    boxShadow: '0 0 0 2px rgba(16, 23, 32, 0.2)'
                  }
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#101720';
                  e.target.style.boxShadow = '0 0 0 2px rgba(16, 23, 32, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={handleStatusFilter}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors"
              style={{ 
                '&:focus': { 
                  outline: 'none', 
                  borderColor: '#101720',
                  boxShadow: '0 0 0 2px rgba(16, 23, 32, 0.2)'
                }
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#101720';
                e.target.style.boxShadow = '0 0 0 2px rgba(16, 23, 32, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
              <option value="won">Won</option>
            </select>

            {/* Source Filter */}
            <select
              value={filters.source}
              onChange={handleSourceFilter}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors"
              style={{ 
                '&:focus': { 
                  outline: 'none', 
                  borderColor: '#101720',
                  boxShadow: '0 0 0 2px rgba(16, 23, 32, 0.2)'
                }
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#101720';
                e.target.style.boxShadow = '0 0 0 2px rgba(16, 23, 32, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="facebook_ads">Facebook Ads</option>
              <option value="google_ads">Google Ads</option>
              <option value="referral">Referral</option>
              <option value="events">Events</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t pt-3 mt-3">
              <div className="flex flex-wrap gap-3">
                {/* Score Range Filter */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-900 mb-1">Score Range</label>
                  <select
                    value={filters.scoreRange}
                    onChange={handleScoreFilter}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors"
                    style={{ 
                      '&:focus': { 
                        outline: 'none', 
                        borderColor: '#101720',
                        boxShadow: '0 0 0 2px rgba(16, 23, 32, 0.2)'
                      }
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#101720';
                      e.target.style.boxShadow = '0 0 0 2px rgba(16, 23, 32, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Any Score</option>
                    <option value="80-100">High (80-100)</option>
                    <option value="60-79">Medium (60-79)</option>
                    <option value="40-59">Low (40-59)</option>
                    <option value="0-39">Very Low (0-39)</option>
                  </select>
                </div>

                {/* Value Range Filter */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-gray-900 mb-1">Lead Value</label>
                  <select
                    value={filters.valueRange}
                    onChange={handleValueFilter}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium transition-colors"
                    style={{ 
                      '&:focus': { 
                        outline: 'none', 
                        borderColor: '#101720',
                        boxShadow: '0 0 0 2px rgba(16, 23, 32, 0.2)'
                      }
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#101720';
                      e.target.style.boxShadow = '0 0 0 2px rgba(16, 23, 32, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Any Value</option>
                    <option value="10000+">$10,000+</option>
                    <option value="5000-9999">$5,000 - $9,999</option>
                    <option value="1000-4999">$1,000 - $4,999</option>
                    <option value="0-999">Under $1,000</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: '#101720' }}>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Contact
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Company
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Location
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Source
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Score
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Value
              </th>
              <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && leads.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-3 py-8 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2" style={{ borderColor: '#101720' }}></div>
                  <p className="text-gray-700 text-sm font-medium">Loading leads...</p>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-3 py-8 text-center">
                  <p className="text-gray-700 text-sm font-medium">No leads found.</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {lead.first_name} {lead.last_name}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm text-black font-medium">{lead.email}</div>
                    {lead.phone && (
                      <div className="text-xs text-gray-600 font-normal">{lead.phone}</div>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm text-black font-medium">{lead.company || '-'}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm text-black font-medium">
                      {lead.city && lead.state ? `${lead.city}, ${lead.state}` : lead.city || lead.state || '-'}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-black">
                    <span className="truncate max-w-20 block font-medium" title={getSourceLabel(lead.source)}>
                      {getSourceLabel(lead.source) || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {getScoreBadge(lead.score)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-black font-medium">
                    {lead.lead_value ? `$${lead.lead_value.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit(lead)}
                        className="text-black hover:text-gray-600 p-1 transition-colors"
                        title="Edit lead"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="text-gray-600 hover:text-black p-1 transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  Showing{' '}
                  <span className="font-bold">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-bold">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => onPageChange(pageNumber)}
                        className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium transition-colors ${
                          pageNumber === pagination.page
                            ? 'z-10 text-white border-black'
                            : 'bg-white border-gray-300 text-black hover:bg-gray-100'
                        }`}
                        style={pageNumber === pagination.page ? { backgroundColor: '#101720', borderColor: '#101720' } : {}}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
