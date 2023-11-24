"use client";

import { PhoneNumber, Phonebook } from "@/constants/types";
import {
  ADD_CONTACT,
  EDIT_CONTACT,
  GET_CONTACT_DETAIL,
} from "@/constants/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PhoneComponent from "./PhoneComponent";
import mq from "@/constants/StyleConstant";
import { useSessionStorage } from "@/context/SessionStorageContext";

/**
 * Crud Component
 */
export default function CrudComponent({
  id,
  navigateBack,
  isEditMode,
}: {
  id: string | undefined;
  navigateBack: () => void;
  isEditMode: boolean;
}) {
  const { data } = useQuery(GET_CONTACT_DETAIL, {
    variables: { id },
    skip: !isEditMode,
  });
  const [createContact, { loading: addLoading, error: addError }] =
    useMutation(ADD_CONTACT);
  const [editContact, { loading: editLoading, error: editError }] =
    useMutation(EDIT_CONTACT);
  const formRef = useRef<HTMLFormElement>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);
  const { clearDataFromSessionStorage } = useSessionStorage();

  useEffect(() => {
    if (data) {
      const phoneNumberList = data.contact_by_pk.phones.map(
        (val: PhoneNumber) => val.number
      );
      setPhoneNumbers(phoneNumberList);
    }
  }, [data, id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(formRef.current!);
    const first_name = form.get("first_name") || '';
    const last_name = form.get("last_name") || '';
    const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if(specialCharacterRegex.test(first_name?.toString()) || specialCharacterRegex.test(last_name?.toString())) {
      return alert("Contact Name must be unique and doesn`t have a special Character")
    }

    const spec = {} as Phonebook;
    if (first_name) {
      spec.first_name = first_name.toString();
    }
    if (last_name) {
      spec.last_name = last_name.toString();
    }

    if (!isEditMode) {
      spec.phones = phoneNumbers.reduce(function (
        result: PhoneNumber[],
        element
      ) {
        element && result.push({ number: element });
        return result;
      },
      []);
      handleCreate(spec);
    } else {
      const editSpec = {
        id: id,
        _set: {
          ...spec,
        },
      };
      handleEdit(editSpec);
    }
  };

  const handleCreate = async (spec: Phonebook) => {
    try {
      await createContact({
        variables: {
          ...spec,
        },
      });
      alert("Data added successfully!");
      clearDataFromSessionStorage();
      navigateBack();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (spec: any) => {
    try {
      await editContact({
        variables: {
          ...spec,
        },
      });
      alert("Data updated successfully!");
      clearDataFromSessionStorage();
      navigateBack();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPhoneNumber = () => {
    const newPhoneNumber = "";
    setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
  };

  const handleOnPhoneChange = (number: string, index: number) => {
    const updatedPhoneNumbers = [...phoneNumbers];
    if (number) {
      updatedPhoneNumbers[index] = number;
      setPhoneNumbers(updatedPhoneNumbers);
    } else {
      updatedPhoneNumbers.splice(index, 1);
      setPhoneNumbers(updatedPhoneNumbers);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div
        css={css(`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        ${mq[1]} {
          max-width: 50%;
        }
        div {   
            display: flex;
            align-item: center;
            gap: 0.5rem;
            input {
                width: 40%;
                min-width: 250px;
                flex: 1;
            }
            label {
                min-width: 100px;
            }
        }

        .phone {
          label {
            padding-top: 0.25rem;
          }
        }
        .phone-container {
          display: flex;
          flex-direction: column;
          width: 40%;
          flex: 1;
          min-width: 250px;
          div {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: space-between;
            min-width: 250px;
        }
        input {
            font-size: 14px;
            min-width: 20%;
        }
        .phone-number {
            width: fit-content;
            min-width: 250px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }
        .button-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: fit-content;
            flex: none;
        }
        }
        `)}
      >
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            css={{ fontSize: "14px" }}
            id="first_name"
            name="first_name"
            defaultValue={data?.contact_by_pk.first_name}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            css={{ fontSize: "14px" }}
            id="last_name"
            name="last_name"
            defaultValue={data?.contact_by_pk.last_name}
          />
        </div>
        <div className="phone">
          <label>Phone Number</label>
          <div className="phone-container">
            {phoneNumbers.map((phoneNumber, index) => (
              <PhoneComponent
                key={index}
                number={phoneNumber}
                index={index}
                contact_id={id}
                onContactAction={handleOnPhoneChange}
                isEditMode={id !== "create"}
              ></PhoneComponent>
            ))}
          </div>
        </div>
        <div>
          <label></label>
          <button aria-label={'btn-add-phone'} type="button" onClick={handleAddPhoneNumber}>
            Add
          </button>
        </div>
        <div css={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button type="submit" aria-label={'btn-save-contact'}>Save</button>
          <Link href=".." aria-label={'link-cancel-contact'}>
            <button className="cancel" type="submit" aria-label={'btn-cancel-contact'}>
              Cancel
            </button>
          </Link>
        </div>
        {(addError || editError) && (
          <div className="error">{addError?.message || editError?.message}</div>
        )}
      </div>
    </form>
  );
}
