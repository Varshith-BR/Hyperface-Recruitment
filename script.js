const form=document.getElementById('transactionForm');
const transactionsDiv=document.getElementById('transactions');
const balanceSpan=document.getElementById('balance');

let transactions=[];
let editingId=null;

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (amount > 0) {
    if (editingId !== null) {
      const index = transactions.findIndex(tx => tx.id === editingId);
      if (index !== -1) {
        transactions[index] = { id: editingId, description, amount, type };
      }
      editingId = null;
      form.querySelector('button').textContent = 'Add';
    } else {
      const transaction = {
        id: Date.now(),
        description,
        amount,
        type
      };
      transactions.push(transaction);
    }

    updatepage();
    form.reset();
  }
});

function updatepage() {
  const tbody = document.getElementById('transactionsBody');
  tbody.innerHTML = '';
  let total = 0;

  transactions.forEach(tx => {
    const row = document.createElement('tr');
    row.setAttribute('style', tx.type === 'debit' ? 'color: red; text-align: center;' : 'text-align: center;');

    row.innerHTML = `
  <td style="padding:8px; border: 1px solid #ccc; text-align: center;">${tx.description}</td>
  <td style="padding:8px; border: 1px solid #ccc; text-align: center;">₹${tx.amount}</td>
  <td style="padding:8px; border: 1px solid #ccc; text-align: center;">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</td>
  <td style="padding:8px; border: 1px solid #ccc; text-align: center;">
    <button onclick="editTransaction(${tx.id})">
      Edit
    </button>
    <button onclick="deleteTransaction(${tx.id})">
      Delete
    </button>
  </td>
`;


    tbody.appendChild(row);
    total += tx.type === 'credit' ? tx.amount : -tx.amount;
  });

  balanceSpan.textContent = total;
}


function deleteTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  updatepage();
}

function editTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (tx) {
    document.getElementById('description').value = tx.description;
    document.getElementById('amount').value = tx.amount;
    document.getElementById('type').value = tx.type;
    editingId = id;
    form.querySelector('button').textContent = 'Update';
  }
}

