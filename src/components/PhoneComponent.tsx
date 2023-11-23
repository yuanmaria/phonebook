"use client";

import { ADD_PHONE, DELETE_PHONE, EDIT_PHONE } from "@/constants/Queries";
import { useMutation } from "@apollo/client";
import { ChangeEvent, useEffect, useState } from "react";

type phoneProps = {
  number: string;
  contact_id: string | undefined;
  index: number;
  isEditMode: boolean;
  onContactAction: (number: string, index: number) => void;
};

/**
 * Phone Component
 */
export default function PhoneComponent({
  isEditMode = false,
  ...props
}: phoneProps) {
  const [createPhone, { error: _addError }] = useMutation(ADD_PHONE);
  const [editPhone, { error: _editError }] = useMutation(EDIT_PHONE);
  const [deletePhone, { error: _deleteError }] = useMutation(DELETE_PHONE);
  const [phoneNumber, setPhoneNumber] = useState(props.number);
  const [isOnEdit, setIsOnEdit] = useState(false);

  useEffect(() => {
    if (!props.number) {
      setIsOnEdit(true);
    } else {
      setIsOnEdit(false);
    }
    setPhoneNumber(props.number);
  }, [props.number]);

  const handleCreate = async (spec: any) => {
    try {
      await createPhone({
        variables: {
          ...spec,
        },
      });
      setIsOnEdit(false);
      props.onContactAction(phoneNumber, props.index);
    } catch (error) {
      console.error(error);
      alert(error)
    }
  };

  const handleEdit = async (spec: any) => {
    try {
      await editPhone({
        variables: {
          ...spec,
        },
      });
      setIsOnEdit(false);
      props.onContactAction(phoneNumber, props.index);
    } catch (error) {
      console.error(error);
      alert(error)
    }
  };

  const handleDelete = async (spec: any) => {
    try {
      await deletePhone({
        variables: {
          ...spec,
        },
      });
      props.onContactAction("", props.index);
    } catch (error) {
      console.error(error);
      alert(error)
    }
  };

  const handleSavePhoneNumber = () => {
    if (!phoneNumber) return;
    if (!isEditMode) {
      setIsOnEdit(false);
      return props.onContactAction(phoneNumber, props.index);
    }
    if (props.number) {
      const spec = {
        pk_columns: {
          number: props.number,
          contact_id: props.contact_id,
        },
        new_phone_number: phoneNumber,
      };
      handleEdit(spec);
    } else {
      const spec = {
        contact_id: Number(props.contact_id),
        phone_number: phoneNumber,
      };
      handleCreate(spec);
    }
  };

  const handleRemovePhoneNumber = () => {
    if (!isEditMode) {
      return props.onContactAction("", props.index);
    }
    const spec = {
      contact_id: Number(props.contact_id),
      phone_number: props.number,
    };
    handleDelete(spec);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleCancel = () => {
    if (props.number) {
      setPhoneNumber(props.number);
      setIsOnEdit(false);
    } else {
      return props.onContactAction("", props.index);
    }
  };

  return isOnEdit ? (
    <div>
      <input
        type="text"
        onChange={(e) => handleChange(e)}
        value={phoneNumber}
      />
      <div className="button-group">
        <button type="button" onClick={() => handleSavePhoneNumber()} aria-label={'btn-save-phone'}>
          Save
        </button>
        <button type="button" className="cancel" onClick={handleCancel} aria-label={'btn-cancel-phone'}>
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div>
      <div className="phone-number">{phoneNumber}</div>
      <div className="button-group">
        <button type="button" onClick={() => setIsOnEdit(true)} aria-label={'btn-edit-phone'}>
          Edit
        </button>
        <button
          type="button"
          className="cancel"
          onClick={() => handleRemovePhoneNumber()}
          aria-label={'btn-remove-phone'}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
