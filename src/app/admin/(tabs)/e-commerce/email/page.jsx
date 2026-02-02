"use client";

import React, { useEffect, useState } from "react";
import { useEmailSettingsContext } from "@/context/storeEmails";
import { Mail, Settings, Users, Shield, Edit, Save, X } from "lucide-react";
import Loading from "@/components/loading";

const EmailSettingsAdmin = () => {
  const {
    generalSettings,
    loading,
    btnLoading,
    fetchEmailSettings,
    adminNotifications,
    customerNotifications,
    updateNotification,
    updateGeneralSettings,
  } = useEmailSettingsContext();


  useEffect(()=>{
    fetchEmailSettings()
  },[])

  const [activeTab, setActiveTab] = useState("general");
  const [editingNotification, setEditingNotification] = useState(null);
  const [generalForm, setGeneralForm] = useState({
    fromName: "",
    fromAddress: "",
    emailFooterText: "",
  });



  React.useEffect(() => {
    if (generalSettings) {
      setGeneralForm({
        fromName: generalSettings.fromName || "",
        fromAddress: generalSettings.fromAddress || "",
        emailFooterText: generalSettings.emailFooterText || "",
      });
    }
  }, [generalSettings]);

  const adminNotificationTypes = [
    "newOrder",
    "canceledOrder",
    "failedOrder",
    "refundedOrder",
  ];
  const customerNotificationTypes = [
    "processingOrder",
    "completedOrder",
    "customerOnHoldOrder",
    "customerProcessingOrder",
    "customerCompletedOrder",
    "customerInvoice",
    "customerNote",
    "customerResetPassword",
    "customerNewAccount",
  ];

  const getNotificationData = (type) => {
    if (adminNotificationTypes.includes(type)) {
      const existingNotification = adminNotifications.find(
        (notif) => notif.type === type,
      );
      if (existingNotification) {
        return existingNotification;
      }
    } else {
      const existingNotification = customerNotifications.find(
        (notif) => notif.type === type,
      );
      if (existingNotification) {
        return existingNotification;
      }
    }

    return {
      type,
      enabled: true,
      ...(adminNotificationTypes.includes(type) && { recipientAddress: "" }),
      subject: "",
      heading: "",
      additionalContent: "",
    };
  };

  const handleGeneralSubmit = async () => {
    await updateGeneralSettings(generalForm);
  };

  const handleNotificationEdit = (type) => {
    const notificationData = getNotificationData(type);
    setEditingNotification({
      ...notificationData,
      originalType: type,
    });
  };

  const handleNotificationSave = async () => {
    if (editingNotification) {
      const { originalType, ...updateData } = editingNotification;
      await updateNotification(originalType, updateData);
      setEditingNotification(null);
    }
  };

  const handleNotificationCancel = () => {
    setEditingNotification(null);
  };

  const getNotificationDisplayName = (type) => {
    const names = {
      newOrder: "New Order",
      canceledOrder: "Canceled Order",
      failedOrder: "Failed Order",
      refundedOrder: "Refunded Order",
      processingOrder: "Processing Order",
      completedOrder: "Completed Order",
      customerOnHoldOrder: "Customer Order On Hold",
      customerProcessingOrder: "Customer Processing Order",
      customerCompletedOrder: "Customer Completed Order",
      customerInvoice: "Customer Invoice",
      customerNote: "Customer Note",
      customerResetPassword: "Reset Password",
      customerNewAccount: "New Account",
    };
    return names[type] || type;
  };

  const getNotificationDescription = (type) => {
    const descriptions = {
      newOrder: "Email sent to admin when a new order is placed",
      canceledOrder: "Email sent to admin when an order is canceled",
      failedOrder: "Email sent to admin when an order fails",
      refundedOrder: "Email sent to admin when an order is refunded",
      processingOrder:
        "Email sent to customer when order status changes to processing",
      completedOrder: "Email sent to customer when order is completed",
      customerOnHoldOrder: "Email sent to customer when order is put on hold",
      customerProcessingOrder: "Email sent to customer during order processing",
      customerCompletedOrder: "Email sent to customer when order is completed",
      customerInvoice: "Invoice email sent to customer",
      customerNote: "Email sent to customer with order notes",
      customerResetPassword: "Password reset email for customers",
      customerNewAccount: "Welcome email for new customer accounts",
    };
    return descriptions[type] || "";
  };

  const isNotificationConfigured = (type) => {
    if (adminNotificationTypes.includes(type)) {
      return adminNotifications.some((notif) => notif.type === type);
    } else {
      return customerNotifications.some((notif) => notif.type === type);
    }
  };

  if (loading) {
    return (
     <Loading/>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Email Settings
        </h1>
        <p className="text-gray-600">
          Configure email notifications and general email settings for your
          store
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "general"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            General Settings
          </button>
          {/* <button
            onClick={() => setActiveTab("admin")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "admin"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Admin Notifications ({adminNotificationTypes.length})
          </button> */}
          {/* <button
            onClick={() => setActiveTab("customer")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "customer"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Customer Notifications ({customerNotificationTypes.length})
          </button> */}
        </nav>
      </div>

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">General Email Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Name
              </label>
              <input
                type="text"
                value={generalForm.fromName}
                onChange={(e) =>
                  setGeneralForm({ ...generalForm, fromName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Store Name"
              />
              <p className="text-sm text-gray-500 mt-1">
                The name that appears in the "From" field of emails
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Address
              </label>
              <input
                type="email"
                value={generalForm.fromAddress}
                onChange={(e) =>
                  setGeneralForm({
                    ...generalForm,
                    fromAddress: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="noreply@yourstore.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                The email address that appears in the "From" field
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Footer Text
              </label>
              <textarea
                value={generalForm.emailFooterText}
                onChange={(e) =>
                  setGeneralForm({
                    ...generalForm,
                    emailFooterText: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thank you for shopping with us..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Text that appears at the bottom of all emails
              </p>
            </div>

            <button
              type="button"
              onClick={handleGeneralSubmit}
              disabled={btnLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {btnLoading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}

      {/* Admin Notifications Tab */}
      {/* {activeTab === "admin" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900">Admin Notifications</h3>
            <p className="text-sm text-blue-700 mt-1">
              These emails are sent to administrators when specific events occur
            </p>
          </div>

          {adminNotificationTypes.map((type) => {
            const notification = getNotificationData(type);
            return (
              <NotificationCard
                key={type}
                notification={notification}
                isEditing={editingNotification?.originalType === type}
                editingNotification={editingNotification}
                setEditingNotification={setEditingNotification}
                onEdit={() => handleNotificationEdit(type)}
                onSave={handleNotificationSave}
                onCancel={handleNotificationCancel}
                getDisplayName={getNotificationDisplayName}
                getDescription={getNotificationDescription}
                btnLoading={btnLoading}
                showRecipientAddress={true}
                isNew={!isNotificationConfigured(type)}
              />
            );
          })}
        </div>
      )} */}

      {/* Customer Notifications Tab */}
      {/* {activeTab === "customer" && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900">
              Customer Notifications
            </h3>
            <p className="text-sm text-green-700 mt-1">
              These emails are sent to customers during their order journey
            </p>
          </div>

          {customerNotificationTypes.map((type) => {
            const notification = getNotificationData(type);
            return (
              <NotificationCard
                key={type}
                notification={notification}
                isEditing={editingNotification?.originalType === type}
                editingNotification={editingNotification}
                setEditingNotification={setEditingNotification}
                onEdit={() => handleNotificationEdit(type)}
                onSave={handleNotificationSave}
                onCancel={handleNotificationCancel}
                getDisplayName={getNotificationDisplayName}
                getDescription={getNotificationDescription}
                btnLoading={btnLoading}
                showRecipientAddress={false}
                isNew={!isNotificationConfigured(type)}
              />
            );
          })}
        </div>
      )} */}
    </div>
  );
};

const NotificationCard = ({
  notification,
  isEditing,
  editingNotification,
  setEditingNotification,
  onEdit,
  onSave,
  onCancel,
  getDisplayName,
  getDescription,
  btnLoading,
  showRecipientAddress,
  isNew,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Mail
              className={`w-5 h-5 ${notification.enabled ? "text-green-500" : "text-gray-400"}`}
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-900">
                  {getDisplayName(notification.type)}
                </h3>
                {isNew && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Not Configured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {getDescription(notification.type)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={
                  isEditing ? editingNotification.enabled : notification.enabled
                }
                onChange={(e) => {
                  if (isEditing) {
                    setEditingNotification({
                      ...editingNotification,
                      enabled: e.target.checked,
                    });
                  }
                }}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Enabled</label>
            </div>
            {!isEditing && (
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 border-t pt-4">
            {showRecipientAddress && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={editingNotification.recipientAddress || ""}
                  onChange={(e) =>
                    setEditingNotification({
                      ...editingNotification,
                      recipientAddress: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@yourstore.com"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={editingNotification.subject || ""}
                onChange={(e) =>
                  setEditingNotification({
                    ...editingNotification,
                    subject: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email subject line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={editingNotification.heading || ""}
                onChange={(e) =>
                  setEditingNotification({
                    ...editingNotification,
                    heading: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email heading"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Content
              </label>
              <textarea
                value={editingNotification.additionalContent || ""}
                onChange={(e) =>
                  setEditingNotification({
                    ...editingNotification,
                    additionalContent: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional email content..."
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={onSave}
                disabled={btnLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {btnLoading ? "Saving..." : isNew ? "Create" : "Save"}
              </button>
              <button
                onClick={onCancel}
                disabled={btnLoading}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-sm border-t pt-4">
            {showRecipientAddress && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Recipient:</span>
                <span className="text-gray-900">
                  {notification.recipientAddress || "Not set"}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Subject:</span>
              <span className="text-gray-900">
                {notification.subject || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Heading:</span>
              <span className="text-gray-900">
                {notification.heading || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  notification.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {notification.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            {notification.additionalContent && (
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  Additional Content:
                </span>
                <span className="text-gray-900 max-w-xs truncate">
                  {notification.additionalContent}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSettingsAdmin;
