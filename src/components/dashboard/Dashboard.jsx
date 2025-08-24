import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Github } from 'lucide-react';
import { leadsApi } from '../../services/apiService';
import LeadsList from './LeadsList';
import CreateLeadModal from './CreateLeadModal';
import EditLeadModal from './EditLeadModal';

export default function Dashboard({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    scoreRange: '',
    valueRange: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit
      });

      if (filters.search) {
        queryParams.append('filter[email][contains]', filters.search);
      }
      if (filters.status) {
        queryParams.append('filter[status][equals]', filters.status);
      }
      if (filters.source) {
        queryParams.append('filter[source][equals]', filters.source);
      }
      if (filters.scoreRange) {
        const [min, max] = filters.scoreRange.includes('+') 
          ? [filters.scoreRange.replace('+', ''), '100']
          : filters.scoreRange.split('-');
        if (max) {
          queryParams.append('filter[score][between]', `${min},${max}`);
        } else {
          queryParams.append('filter[score][gt]', min);
        }
      }
      if (filters.valueRange) {
        const [min, max] = filters.valueRange.includes('+') 
          ? [filters.valueRange.replace('+', ''), '999999999']
          : filters.valueRange.split('-');
        if (max) {
          queryParams.append('filter[lead_value][between]', `${min},${max}`);
        } else {
          queryParams.append('filter[lead_value][gt]', min);
        }
      }

      const response = await leadsApi.getAll(`?${queryParams.toString()}`);
      
      setLeads(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleCreateLead = async (leadData) => {
    try {
      await leadsApi.create(leadData);
      setShowCreateModal(false);
      fetchLeads();
    } catch (err) {
      console.error('Failed to create lead:', err);
    }
  };

  const handleUpdateLead = async (id, leadData) => {
    try {
      await leadsApi.update(id, leadData);
      setEditingLead(null);
      fetchLeads(); // Refresh the list
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        setError(null);
        setSuccessMessage(null);
        
        console.log('Attempting to delete lead with ID:', id);
        
        const response = await leadsApi.delete(id);
        console.log('Delete response:', response);
        
        setLeads(prevLeads => {
          const updatedLeads = prevLeads.filter(lead => lead.id !== id);
          console.log('Updated leads list:', updatedLeads.length, 'leads remaining');
          return updatedLeads;
        });
        
        setPagination(prev => {
          const newTotal = Math.max(0, prev.total - 1);
          const newTotalPages = Math.ceil(newTotal / prev.limit);
          const currentPage = prev.page;
          
          const adjustedPage = currentPage > newTotalPages ? Math.max(1, newTotalPages) : currentPage;
          
          console.log('Updated pagination:', { newTotal, newTotalPages, adjustedPage });
          
          return {
            ...prev,
            total: newTotal,
            totalPages: newTotalPages,
            page: adjustedPage
          };
        });
        
        setSuccessMessage('Lead deleted successfully');
        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        
      } catch (err) {
        console.error('Failed to delete lead:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
        
        setError(`Failed to delete lead: ${err.message}`);
        
        console.log('Refreshing leads list due to error...');
        fetchLeads();
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#101720' }}></div>
          <p className="text-gray-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white border-b border-gray-200">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-black">Lead Management System</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border-2 border-black text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                style={{ backgroundColor: '#101720', borderColor: '#101720' }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Lead
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 bg-white">
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 rounded-md p-4">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-white border-l-4 rounded-md p-4" style={{ borderColor: '#101720' }}>
            <p className="text-gray-900 font-medium">Error: {error}</p>
          </div>
        )}

        <LeadsList
          leads={leads}
          loading={loading}
          pagination={pagination}
          filters={filters}
          onPageChange={handlePageChange}
          onFilterChange={handleFilterChange}
          onEdit={setEditingLead}
          onDelete={handleDeleteLead}
        />
      </div>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="w-full px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              Built for Erino's SDE Internship Task
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/code-Harsh247/erico-lead-management-system"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Github className="w-5 h-5 mr-2" />
                Frontend Code
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="https://github.com/code-Harsh247/erico-lead-management-system-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Github className="w-5 h-5 mr-2" />
                Backend Code
              </a>
            </div>
          </div>
        </div>
      </footer>

      {showCreateModal && (
        <CreateLeadModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLead}
        />
      )}

      {editingLead && (
        <EditLeadModal
          lead={editingLead}
          onClose={() => setEditingLead(null)}
          onSubmit={(leadData) => handleUpdateLead(editingLead.id, leadData)}
        />
      )}
    </div>
  );
}
