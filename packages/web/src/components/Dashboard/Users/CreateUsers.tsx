import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ROLES, Role } from '../../../constants/roles'
import { User } from '../../../types/User'
import { createUser, updateUser } from '../../../services/UserService'

type FormData = {
  id?: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: Role
}

type Props = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  userToEdit?: User | null
  onSave: (user: User) => void
}

const CreateUserModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  userToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<FormData>({
    id: userToEdit?.id,
    firstName: userToEdit?.firstName || '',
    lastName: userToEdit?.lastName || '',
    email: userToEdit?.email || '',
    password: '',
    role: (userToEdit?.role as Role) || ROLES.USER
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'role' ? (value as Role) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validation
    const newErrors: Partial<FormData> = {}
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
    }
    if (!formData.password && !userToEdit) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      let user: User
      if (userToEdit && userToEdit.id) {
        const updateData: FormData = {
          ...formData,
          id: userToEdit.id // Ensure id is always a string
        }
        await updateUser(userToEdit.id, updateData as FormData & { id: string })
        user = { ...userToEdit, ...updateData }
      } else {
        const newUser = await createUser(formData)
        user = { ...formData, id: newUser.id } as User
      }

      onSave(user)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create or update user:', error)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900"
                        >
                          {userToEdit ? 'Edit User' : 'Create User'}
                        </Dialog.Title>
                        <div className="mt-2">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="first-name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                First name
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                id="first-name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.firstName && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="last-name"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Last name
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                id="last-name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.lastName && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.email}
                                </p>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Password
                              </label>
                              <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.password}
                                </p>
                              )}
                            </div>

                            <div>
                              <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Role
                              </label>
                              <select
                                name="role"
                                id="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">Select a role</option>
                                {Object.values(ROLES).map((role) => (
                                  <option key={role} value={role}>
                                    {role[0].toUpperCase() + role.slice(1)}
                                  </option>
                                ))}
                              </select>
                              {errors.role && (
                                <p className="mt-2 text-sm text-red-600">
                                  {errors.role}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {userToEdit ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default CreateUserModal
