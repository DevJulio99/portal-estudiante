<script setup lang="ts">
  interface Column {
    key: string;
    label: string;
    headerClass?: string;
    cellClass?: string;
    isAction?: boolean;
  }

  interface PaginationData {
    total: number;
    currentPage: number;
    itemsPerPage: number;
  }

  interface Props {
    columns: Column[];
    data: any[];
    loading?: boolean;
    noDataText?: string;
    rowKey?: string;
    
    showPagination?: boolean;
    paginationData?: PaginationData;
    
    showInfoAction?: boolean;
    showEditAction?: boolean;
    showDeleteAction?: boolean;
    showRegisterNotesAction?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    noDataText: 'No se encontraron datos',
    rowKey: 'id',
    showPagination: true,
    showInfoAction: true,
    showEditAction: true,
    showDeleteAction: true,
    showRegisterNotesAction: false,
  });

  defineEmits<{
    info: [item: any];
    edit: [item: any];
    delete: [item: any];
    'register-notes': [item: any];
    'page-change': [page: number];
  }>();

  const dataColumns = computed(() => {
    return props.columns.filter(col => !col.isAction);
  });

  const hasActionsColumn = computed(() => {
    return props.showInfoAction || props.showEditAction || props.showDeleteAction || props.showRegisterNotesAction ||
          props.columns.some(col => col.isAction);
  });

  const getRowKey = (item: any, index: number) => {
    return item[props.rowKey] || index;
  };

  const getColumnValue = (item: any, key: string) => {
    return key.split('.').reduce((obj, prop) => obj?.[prop], item) || '';
  };
</script>

<template>
  <div class="w-full">
    <slot name="actions" />
    
    <div class="w-full">
      <div class="table-container">
        <table class="w-full base-table">
          <thead>
            <tr>
              <th 
                v-for="column in columns" 
                :key="column.key"
                :class="column.headerClass || 'min-w-[120px]'"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="relative">
            <tr v-if="loading">
              <td :colspan="columns.length">
                <BaseStatusLoading class="w-full py-10" />
              </td>
            </tr>
            
            <tr v-else-if="!data.length">
              <td :colspan="columns.length">
                <div class="w-full py-10 text-xl font-bold">
                  {{ noDataText || 'No se encontraron datos' }}
                </div>
              </td>
            </tr>
            
            <tr v-else v-for="(item, index) in data" :key="getRowKey(item, index)">
              <td 
                v-for="column in dataColumns" 
                :key="column.key"
                :class="column.cellClass"
              >
                <slot 
                  :name="`cell-${column.key}`" 
                  :item="item" 
                  :value="getColumnValue(item, column.key)"
                  :index="index"
                >
                  {{ getColumnValue(item, column.key) }}
                </slot>
              </td>
              
              <td v-if="hasActionsColumn" class="action-column">
                <div class="action-buttons">
                  <button 
                    v-if="showInfoAction"
                    class="btn-action" 
                    @click="$emit('info', item)"
                    title="Ver información"
                  >
                    <nuxt-icon name="eyeIcon" class="action-icon" />
                  </button>
                  
                  <button 
                    v-if="showEditAction"
                    class="btn-action btn-edit" 
                    @click="$emit('edit', item)"
                    title="Editar"
                  >
                    <nuxt-icon name="editIcon" class="action-icon" />
                  </button>
                  
                  <button 
                    v-if="showDeleteAction"
                    class="btn-action btn-delete" 
                    @click="$emit('delete', item)"
                    title="Eliminar"
                  >
                    <nuxt-icon name="closeIcon" class="action-icon" />
                  </button>

                  <button
                    v-if="showRegisterNotesAction"
                    class="btn-action btn-register-notes"
                    @click="$emit('register-notes', item)"
                    title="Registrar Notas"
                  >
                    <nuxt-icon name="fileList" class="action-icon" />
                  </button>
                  
                  <slot name="custom-actions" :item="item" :index="index" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <BasePagination
          v-if="showPagination && data.length && paginationData"
          class="my-3"
          :totalItems="paginationData.total"
          :currentPage="paginationData.currentPage"
          :items-per-page="paginationData.itemsPerPage"
          @change="$emit('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>



<style scoped>
  .table-container {
    width: 100%;
    overflow-x: auto;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
  }

  .table-container::-webkit-scrollbar {
    height: 8px;
  }

  .table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .table-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  .base-table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    border: 2px solid #E5E7EB;
    border-radius: 12px;
    min-width: 1000px;
    position: relative;
  }

  .base-table th {
    font-family: 'grotesk';
    font-size: 16px;
    color: #6B7280;
    padding: 20px 20px 21px;
    background-color: #F9FAFB;
    border: none;
    font-weight: 600;
    box-sizing: border-box;
    white-space: nowrap;
    text-align: center;
  }

  .base-table td {
    padding: 29px 20px;
    color: #374151;
    font-size: 14px;
    border-top: 1px solid #E5E7EB;
    background-color: #FFFFFF;
    white-space: nowrap;
    text-align: center;
    font-family: 'nunito';
  }

  tr:nth-child(odd),
  tr:nth-child(odd) td {
    background-color: #FFFFFF;
  }

  tr:nth-child(even),
  tr:nth-child(even) td {
    background-color: #FFFFFF;
  }

  .action-column {
    text-align: center;
    width: 140px;
    min-width: 140px;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .btn-action {
    background: #F4F4F4;
    border: 1px solid #D1D1D1;
    border-radius: 4px;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    position: relative;
  }

  .btn-action:hover {
    background: #E0E0E0;
    transform: scale(1.05);
  }

  .btn-edit {
    background: #F4F4F4;
    border-color: #D1D1D1;
  }

  .btn-edit:hover {
    background: #E0E0E0;
  }

  .btn-delete {
    background: #F4F4F4;
    border-color: #D1D1D1;
  }

  .btn-delete:hover {
    background: #E0E0E0;
  }

  .action-icon {
    height: 16px;
    transition: color 0.2s ease;
    display: block;
    margin: 0;
    flex-shrink: 0;
    line-height: 1;
  }

  .btn-action .action-icon {
    color: #031448;
  }

  .btn-edit .action-icon {
    color: #287f6b;
  }

  .btn-delete .action-icon {
    color: #dc3545;
  }

  @media (max-width: 600px) {
    .base-table th {
      font-size: 12px;
      padding: 15px 10px;
    }

    .base-table td {
      font-size: 12px;
      padding: 20px 10px;
    }
    
    .action-buttons {
      gap: 4px;
    }
    
    .btn-action {
      width: 28px;
      height: 28px;
      min-width: 28px;
      min-height: 28px;
      padding: 0;
    }
    
    .action-icon {
      width: 14px;
      height: 14px;
    }
  }

  .content-left {
    text-align: left;
  }

  .btn-action:focus {
    outline: 2px solid #287F6B;
    outline-offset: 2px;
  }
</style>
