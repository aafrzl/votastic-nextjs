import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Button from './Button';

interface Props {
  isOpen?: boolean;
  title?: string;
  subtitle?: string;
  positiveText?: string;
  negativeText?: string;
  onPositiveClick?: () => void;
  onNegativeClick?: () => void;
}

export default function Alert(props: Props) {
  let [isOpen, setIsOpen] = useState(props.isOpen);

  return (
    <>
      <Transition
        appear
        show={isOpen}
        as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    {props.title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{props.subtitle}</p>
                  </div>

                  <div className={`space-x-3 mt-5`}>
                    <button
                      className="text-sm bg-zinc-100 px-3 py-2 hover:bg-zinc-200 rounded-full"
                      onClick={() => {
                        props.onNegativeClick;
                        setIsOpen(false);
                      }}>
                      {props.negativeText || 'Kembali'}
                    </button>
                    <Button
                      className={`${!props.onPositiveClick && 'hidden'} rounded-full`}
                      onClick={() => {
                        props.onPositiveClick && props.onPositiveClick();
                        setIsOpen(false);
                      }}
                      size="sm"
                      text={props.positiveText || 'Ya'}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export function showAlert(props: Props) {
  const alert = document.createElement('div');
  alert.id = 'alert';
  document.body.appendChild(alert);
  const root = createRoot(alert);
  root.render(
    <Alert
      isOpen={true}
      title={props.title}
      subtitle={props.subtitle}
      positiveText={props.positiveText}
      negativeText={props.negativeText}
      onPositiveClick={props.onPositiveClick}
      onNegativeClick={props.onNegativeClick}
    />
  );
}
