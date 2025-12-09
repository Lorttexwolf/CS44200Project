'use client';

import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useParkingLots } from '@/hooks/useParkingLots';
import { ParkingLot } from '@/models/ParkingLot';
import {
  faCheck,
  faClock,
  faMapMarkerAlt,
  faParking,
  faPencil,
  faPlus,
  faTrash,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { parkingLots, loading: lotsLoading, createParkingLot, updateParkingLot, deleteParkingLot, refetch } = useParkingLots(1);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>();
  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ParkingLot> & { CampusID: number }>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
    
    if (!authLoading && user && user.servicePermissions !== 'admin' && user.servicePermissions !== 'campus_admin') {
      window.location.href = '/profile';
    }
  }, [user, authLoading]);

  const handleEdit = (lot: ParkingLot) => {
    setSelectedLot(lot);
    setFormData(lot);
    setEditMode(true);
    setCreateMode(false);
    setMessage(null);
  };

  const handleCancel = () => {
    setSelectedLot(null);
    setEditMode(false);
    setCreateMode(false);
    setFormData(null);
    setMessage(null);
  };

  const handleCreate = () => {
    setCreateMode(true);
    setEditMode(false);
    setSelectedLot(null);
    setFormData({
      Name: '',
      Address: '',
      AvailableSpots: 0,
      TotalSpots: 0,
      ImageFileName: '/placeholder-parking.jpg',
      Latitude: 41.580083,
      Longitude: -87.472973,
      CampusID: 1
    });
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    console.log("Saving....");

    try {
      if (createMode) {
        // Ensure campusId is set
        const lotData = {
          ...formData,
          campusId: formData.CampusID || 1
        } as ParkingLot;
        await createParkingLot(lotData);
        setMessage({ type: 'success', text: '✓ Parking lot created successfully!' });

      } else {

        if (!selectedLot?.ID) return;

        if (formData?.ImageFileName && selectedLot?.ImageFileName && formData?.ImageFileName !== selectedLot?.ImageFileName) {
          try {
            await fetch('/api/images/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: selectedLot.ImageFileName }),
            });
          } catch (err) {
            console.warn('Failed to delete old image:', err);
          }
        }

        await updateParkingLot(selectedLot.ID, formData);
        setMessage({ type: 'success', text: '✓ Parking lot updated successfully!' });

      }
      
      setTimeout(() => {
        setEditMode(false);
        setCreateMode(false);
        setSelectedLot(null);
        setFormData({});
        refetch();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: createMode ? '✗ Failed to create parking lot' : '✗ Failed to update parking lot' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, imageUrl?: string) => {

    if (!confirm('Are you sure you want to delete this parking lot? This action cannot be undone.')) {
      return;
    }

    setDeleting(id);
    setMessage(null);

    try {
      await deleteParkingLot(id);

      if (imageUrl.startsWith('/api/images/')) {
        try {
          await fetch('/api/images/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl }),
          });
        } catch (err) {
          console.warn('Failed to delete image:', err);
        }
      }

      setMessage({ type: 'success', text: '✓ Parking lot deleted successfully!' });
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.log(error);
      setMessage({ type: 'error', text: `✗ ${error}` });
    } finally {
      setDeleting(null);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image: url });
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return 'bg-green-500';
    if (percentage > 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAvailabilityBadge = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 30) return { variant: 'default' as const, text: 'Available', color: 'bg-green-100 text-green-800' };
    if (percentage > 10) return { variant: 'secondary' as const, text: 'Limited', color: 'bg-yellow-100 text-yellow-800' };
    return { variant: 'destructive' as const, text: 'Almost Full', color: 'bg-red-100 text-red-800' };
  };

  if (authLoading || lotsLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return null;
  }

  if (user.servicePermissions !== 'admin' && user.servicePermissions !== 'campus_admin') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-6xl">🔒</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <Button onClick={() => window.location.href = '/profile'} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Go to Profile
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <div className="inline-block mb-4">
              <div className="bg-blue-600 text-white rounded-full p-4 shadow-lg">
                <FontAwesomeIcon icon={faParking} className="size-8" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">Manage parking lot images and information</p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {parkingLots.length} Parking Lots
              </span>
              <span>•</span>
              <span>Welcome, {user.firstName}!</span>
            </div>
            
            {!editMode && !createMode && (
              <div className="mt-6">
                <Button 
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-xl cursor-pointer transform hover:scale-105 transition-all"
                  size="lg"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  New Parking Lot
                </Button>
              </div>
            )}
          </div>

          {message && (
            <div
              className={`mb-8 p-4 rounded-xl shadow-lg animate-in slide-in-from-top duration-300 ${
                message.type === 'success' 
                  ? 'bg-green-50 border-2 border-green-200 text-green-800' 
                  : 'bg-red-50 border-2 border-red-200 text-red-800'
              }`}
            >
              <p className="font-semibold text-center">{message.text}</p>
            </div>
          )}

          {(editMode || createMode) ? (
            <Card className="mb-8 shadow-2xl border-2 border-blue-100 overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${createMode ? 'from-green-600 to-green-800' : 'from-blue-600 to-blue-800'} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={createMode ? faPlus : faPencil} className="size-5" />
                    <CardTitle className="text-2xl">
                      {createMode ? 'Create New Parking Lot' : `Edit: ${selectedLot?.Name}`}
                    </CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancel}
                    className="text-white hover:bg-white/20 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faXmark} className="size-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parking Lot Name
                      </label>
                      <Input
                        value={formData?.Name || ''}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <Input
                        value={formData?.Address || ''}
                        onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="text-purple-600" />
                    Availability
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Spots
                      </label>
                      <Input
                        type="number"
                        value={formData?.TotalSpots || ''}
                        onChange={(e) => setFormData({ ...formData, TotalSpots: parseInt(e.target.value) })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Spots
                      </label>
                      <Input
                        type="number"
                        value={formData?.AvailableSpots || ''}
                        onChange={(e) => setFormData({ ...formData, AvailableSpots: parseInt(e.target.value) })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-600" />
                    Location Coordinates
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={formData?.Latitude || ''}
                        onChange={(e) => setFormData({ ...formData, Latitude: parseFloat(e.target.value) })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={formData?.Longitude || ''}
                        onChange={(e) => setFormData({ ...formData, Longitude: parseFloat(e.target.value) })}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📸 Parking Lot Image
                  </h3>
                  <ImageUpload
                    currentImage={formData?.ImageFileName ? `/api/images/${formData?.ImageFileName}` : undefined}
                    onUploadComplete={handleImageUpload}
                  />
                  {formData?.ImageFileName && selectedLot && formData?.ImageFileName !== selectedLot.ImageFileName && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">✓ New image ready to save</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className={`flex-1 ${
                      saving 
                        ? 'bg-gray-400 cursor-not-allowed pointer-events-none' 
                        : createMode
                        ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 cursor-pointer'
                        : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 cursor-pointer'
                    } text-white shadow-lg transition-all`}
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {createMode ? 'Creating...' : 'Applying Changes...'}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={createMode ? faPlus : faCheck} className="mr-2" />
                        {createMode ? 'Create Parking Lot' : 'Save Changes'}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel} 
                    disabled={saving}
                    size="lg"
                    className={`flex-1 border-2 ${
                      saving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    <FontAwesomeIcon icon={faXmark} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parkingLots.map((lot) => {

                const badge = getAvailabilityBadge(lot.AvailableSpots, lot.TotalSpots);
                const percentage = (lot.AvailableSpots / lot.TotalSpots) * 100;
                
                return (
                  <Card key={lot.ID} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-200 group">
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={`/api/images/${lot.ImageFileName}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">{lot.Name}</h3>
                      </div>
                    </div>
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 text-blue-600" />
                        <span>{lot.Address}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 font-medium">Availability</span>
                          <span className="text-gray-900 font-bold">
                            {lot.AvailableSpots} / {lot.TotalSpots} spots
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full ${getAvailabilityColor(lot.AvailableSpots, lot.TotalSpots)} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 pt-4 border-t">
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleEdit(lot)} 
                            className="bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer"
                            size="sm"
                          >
                            <FontAwesomeIcon icon={faPencil} className="mr-2" />
                            Edit
                          </Button>
                          <Button 
                            onClick={() => handleDelete(lot.ID, lot.ImageFileName)}
                            disabled={deleting === lot.id}
                            className={`${
                              deleting === lot.id
                                ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                                : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                            } shadow-md`}
                            size="sm"
                          >
                            {deleting === lot.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <FontAwesomeIcon icon={faTrash} />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
