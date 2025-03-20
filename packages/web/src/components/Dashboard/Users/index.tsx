import React, { useEffect, useState } from 'react'
import { fetchUsers, deleteUser } from '../../../services/UserService'
import { User } from '../../../types/User'
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid'
import CreateUserModal from './CreateUsers' // Assuming you have a CreateUserModal component

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers()
        setUsers(usersData)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    getUsers()
  }, [])

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsSlideOverOpen(true)
  }

  const handleSave = (updatedUser: User) => {
    if (editingUser) {
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      )
    } else {
      setUsers([...users, updatedUser])
    }
    setIsSlideOverOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all the users. You can add, edit, or delete users.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="bg-primary block rounded px-8 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={() => {
              setEditingUser(null)
              setIsSlideOverOpen(true)
            }}
          >
            Add User
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur sm:pl-6 lg:pl-8"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur sm:table-cell"
                  >
                    Last Name
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur lg:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur lg:table-cell"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur sm:pr-6 lg:pr-8"
                  >
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, userIdx) => (
                  <tr key={user.id}>
                    <td
                      className={classNames(
                        userIdx !== users.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8'
                      )}
                    >
                      {user.firstName}
                    </td>
                    <td
                      className={classNames(
                        userIdx !== users.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'
                      )}
                    >
                      {user.lastName}
                    </td>
                    <td
                      className={classNames(
                        userIdx !== users.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                      )}
                    >
                      {user.email}
                    </td>
                    <td
                      className={classNames(
                        userIdx !== users.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'whitespace-nowrap px-3 py-4 text-sm text-gray-500'
                      )}
                    >
                      {user.role}
                    </td>
                    <td
                      className={classNames(
                        userIdx !== users.length - 1
                          ? 'border-b border-gray-200'
                          : '',
                        'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8'
                      )}
                    >
                      <button
                        type="button"
                        className="text-primary hover:text-indigo-900"
                        onClick={() => handleEdit(user)}
                      >
                        <PencilIcon className="size-4" aria-hidden="true" />
                        <span className="sr-only">
                          Edit, {user.firstName} {user.lastName}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="text-primary ml-4 hover:text-indigo-900"
                        onClick={() => handleDelete(user.id ?? '')}
                      >
                        <TrashIcon className="size-4" aria-hidden="true" />
                        <span className="sr-only">
                          Delete, {user.firstName}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isSlideOverOpen}
        setIsOpen={setIsSlideOverOpen}
        userToEdit={editingUser}
        onSave={handleSave}
      />
    </div>
  )
}

export default Users
