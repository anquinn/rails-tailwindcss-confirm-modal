// Custom Tailwind CSS modals for Rails confirm dialogs

const Rails = require("@rails/ujs")

// Cache a copy of the old Rails.confirm since we'll override it when the modal opens
const old_confirm = Rails.confirm;

// Elements we want to listen to for data-confirm
const elements = ['a[data-confirm]', 'button[data-confirm]', 'input[type=submit][data-confirm]']

/* This uses the following `data-` parameters to customize the modal. 
 * You can globally change the defaults below or override select
 * options in the HTML.
 *
 * data-body:     Secondary text for the modal. "This action cannot be undone"
 *                by default.
 * data-commit:   The 'confirm' button text. "Confirm" by default.
 * data-cancel:   The 'cancel' button text. "Cancel" by default.
 * data-color:    The tailwind color to base the modal off of. 
 *                You may have to safelist the background and text color
 *                with purgecss.
*/
const defaults = {
	body: 'This action cannot be undone.',
	commit: 'Confirm',
	cancel: 'Cancel',
	color: 'indigo',
}

const createConfirmModal = (element) => {
	var id = 'confirm-modal-' + String(Math.random()).slice(2, -1);

	var confirm = element.dataset.confirm
	var body = element.dataset.body || defaults.body
	var commit = element.dataset.commit || defaults.commit
	var cancel = element.dataset.cancel || defaults.cancel
	var color = element.dataset.color || defaults.color

	var modal = `
	<div id="${id}" class="fadeIn fixed z-60 inset-0 overflow-y-auto">
		<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			
			<div class="fixed inset-0 transition-opacity" aria-hidden="true">
				<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>

			<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
			

			<div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
				<div class="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
					<button type="button" data-behavior="cancel" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500">
						<span class="sr-only">Close</span>
						<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="sm:flex sm:items-start">
					<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${color}-100 sm:mx-0 sm:h-10 sm:w-10">
						<svg class="h-6 w-6 text-${color}-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
							${confirm}
						</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-500">
								${body}
							</p>
						</div>
					</div>
				</div>
				<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
					<button type="button" data-behavior="commit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-${color}-600 text-base font-medium text-white hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 sm:ml-3 sm:w-auto sm:text-sm">
						${commit}
					</button>
					<button type="button" data-behavior="cancel" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500 sm:mt-0 sm:w-auto sm:text-sm">
						${cancel}
					</button>
				</div>
			</div>
		</div>
	</div>`

	document.body.insertAdjacentHTML('afterbegin', modal)

	var modal = document.getElementById(id)
	element.dataset.confirmModal = `#${id}`

	modal.addEventListener("keyup", (event) => {
		if(event.key === "Escape") {
			event.preventDefault()
			element.removeAttribute("data-confirm-modal")
			modal.remove()
		}
	})

	// Pick up both the 'X - close' and the cancel buttons
	var cancelButton = document.querySelectorAll("[data-behavior='cancel']");
	cancelButton.forEach(function(btn) {
		btn.addEventListener("click", (event) => {
			event.preventDefault()
			element.removeAttribute("data-confirm-modal")
			modal.remove()
		})
	})
	
	modal.querySelector("[data-behavior='commit']").addEventListener("click", (event) => {
		event.preventDefault()

		// Allow the confirm to go through
		Rails.confirm = () => { return true }

		// Click the link again
		element.click()

		// Remove the confirm attribute and modal
		element.removeAttribute("data-confirm-modal")
		Rails.confirm = old_confirm

		modal.remove()
	})

	modal.querySelector("[data-behavior='commit']").focus()
	return modal
}

// Checks if confirm modal is open
const confirmModalOpen = (element) => {
	return !!element.dataset.confirmModal;
}

const handleConfirm = (event) => {
	// If there is a modal open, let the second confirm click through
	if (confirmModalOpen(event.target)) {
		return true

	// First click, we need to spawn the modal
	} else {
		createConfirmModal(event.target)
		return false
	}
}

// When a Rails confirm event fires, we'll handle it
Rails.delegate(document, elements.join(', '), 'confirm', handleConfirm)
