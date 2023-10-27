<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import type { FieldRelation, Page as PageType } from '$lib/types';
  import {
    Page,
    modal,
    Button,
    FormField,
    El,
    FormInput,
    Tabs,
    TabList,
    TabItem,
    TabContent,
    TabPanel,
    FormTextarea,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Icon,
    FormRadioGroup,
    ButtonList,
    confirmModal
  } from '@ulibs/yesvelte';
  import SlotList from '$lib/ui/SlotList.svelte';
  import PreviewModal from './PreviewModal.svelte';
  import PageLoad from '$lib/components/pages/PageLoad.svelte';
  import { slots } from '$lib/stores/pageSlots';
  import DynamicFormField from '$lib/components/content/DynamicFormField.svelte';
  import { t } from '$lib/i18n';
  import { alert } from '@ulibs/yesvelte';
  import Editor from '$lib/components/Editor.svelte';

  export let data;
  let selectedComponent
  let request: Partial<PageType> = data.page;

  //sets and syncs with slots store
  let flag = false;
  slots.subscribe((s) => {
    if (flag) {
      data.page.slot = s;
    }
  });
  $: {
    if ($slots !== data.page.slot) {
      if (data?.page?.slot) {
        slots.set(data.page.slot);
        flag = true;
      }
    }
  }

  function onMove(detail) {
    if (detail.from.length === 0 && detail.to.length === 0) {
      // swap elements
      if (detail.fromIndex < detail.toIndex) {
        detail.toIndex = detail.toIndex - 1;
      }
      const item = request.slot.splice(detail.fromIndex, 1);
      request.slot = [
        ...request.slot.slice(0, detail.toIndex),
        item[0],
        ...request.slot.slice(detail.toIndex)
      ];
      update();
    }
  }

  function update() {
    fetch('?/updatePage', {
      method: 'POST',
      body: JSON.stringify(request)
    }).then((res) => {
      // invalidateAll()
      // alert.success("page updated!")
    });
  }
  async function openPreviewModal() {
    await modal.open(
      PreviewModal,
      {
        slug: request.slug,
        title: request.title,
        autoClose: true
      },
      {
        size: 'lg',
        autoClose: true
      }
    );
  }
  async function openRemoveConfirmModal() {
    const res = await confirmModal.open({ status: 'danger' }, { autoClose: true });
    if (res) {
      fetch('?/removePage', {
        method: 'POST',
        body: JSON.stringify(request)
      }).then((res) => goto('/admin/pages'));
    }
  }

  function updatePage() {
    fetch('?/updatePage', {
      method: 'POST',
      body: JSON.stringify(request)
    }).then((res) => {
      invalidateAll();
      alert.success('page updated!');
    });
  }

  function getItems(load: any): any[] {
    let params = request.slug?.match(/\{\w+\}/g);

    let items: any = {
      page: {
        text: 'Page',
        type: 'object',
        content: {
          slug: {
            text: "Page's Slug",
            type: 'plain_text'
          },
          params: {
            type: 'object',
            text: "Page's URL params",
            content: params?.reduce((prev, curr) => {
              const key = curr.substring(1, curr.length - 1);
              return {
                ...prev,
                [key]: {
                  text: "Page's param (" + key + ')',
                  type: 'plain_text'
                }
              };
            }, {})
          },
          title: {
            text: "Page's Title",
            type: 'plain_text'
          },
          description: {
            text: "Page's Description",
            type: 'plain_text'
          }
        }
      }
    };
    for (let item of load) {
      const table = data.tables.find((x) => x.id === item.table);
      if (!table) continue;

      const fields: any = {};
      for (let field of table.fields) {
        fields[field.name] = {
          text: `${item.name}'s ${field.name}`,
          type: field.type
        };

        if (field.type === 'relation') {
          const otherTable = data.tables.find((x) => x.id === (field as FieldRelation).table);
          const otherFields: any = {};
          for (let otherField of otherTable.fields) {
            otherFields[otherField.name] = {
              text: `${item.name} ${field.name} ${otherField.name}`,
              type: otherField.type
            };
          }

          fields[field.name].content = otherFields;
          fields[field.name].type = field.multiple ? 'array' : 'object';
        }

        if (field.type === 'image' || field.type === 'file') {
          // alt, url, caption from assets....
        }
      }

      items[item.name] = {
        type: item.multiple ? 'array' : 'object',
        text: item.name,
        content: fields
      };
    }

    return items;
  }

</script>

<svelte:head>
	{@html data.page.head ?? ''}
	<title>{data.page.title}</title>
	<meta name="description" content={data.page.description} />
</svelte:head>

<!-- <Page title="Update Page '{data.page.title}'"> -->
  <!-- <El> -->
  <ButtonList slot="header-buttons">
    <Button on:click={() => history.back()}>
      <Icon name="chevron-left" />
      Back
    </Button>
    <Button on:click={openPreviewModal} color="primary">Preview</Button>
  </ButtonList>

  <El row >
	<El  col = 2 >
    {#if !selectedComponent}
		<Tabs   >
		  <Card size = "sm">
			<CardHeader >
			  <TabList >
				<TabItem>General</TabItem>
				<TabItem>Load</TabItem>
				<TabItem>Content</TabItem>
				<TabItem>Forms</TabItem>
			  </TabList>
			</CardHeader>
	
			<TabContent >
			  <CardBody>
				<TabPanel>
				  <FormInput bind:value={request.slug} label="Slug" />
	
				  <DynamicFormField
					items={getItems(request.load)}
					type="plain_text"
					bind:value={request.title}
					label="Title"
				  />
				  <DynamicFormField
					items={getItems(request.load)}
					type="plain_text"
					input_type="textarea"
					label="Description"
					bind:value={request.description}
				  />
				  <DynamicFormField
					dir="ltr"
					items={getItems(request.load)}
					type="plain_text"
					input_type="textarea"
					label="Head"
					bind:value={request.head}
				  />
	
				  <DynamicFormField
					type="select"
					items={getItems(request.load)}
					input_type="radio_group"
					options={[
					  { key: 'rtl', text: 'Right to left' },
					  { key: 'ltr', text: 'Left to right' }
					]}
					bind:value={request.dir}
					label="Direction"
				  />
				</TabPanel>
				<TabPanel>
				  <PageLoad
					items={getItems(request.load)}
					bind:load={request.load}
					bind:tables={data.tables}
				  />
				</TabPanel>
				<TabPanel>
				  <SlotList
					components={data.components}
					items={getItems(request.load)}
					on:move={onMove}
					bind:slotList={request.slot}
				  />
				</TabPanel>
				<TabPanel>
				  {#if data.forms.data.length}
					<!-- <ListBox items={data.forms.data} let:item>
									 <ListItem name="Form">{item.}</ListItem> 
									<ListItem name="URL">{item.pathname}</ListItem>
									<ListItem name="Content (JSON)">{JSON.stringify(item.data).slice(0, 50) + '...'}</ListItem>
									<ListItem name="Created At">{item.created_at}</ListItem>
									
									<ListItem name="Actions">
										<Button on:click={() => modal.open(FormViewer, {data: item.data})} color="primary" size="sm">View</Button>
									</ListItem>
								</ListBox> -->
				  {:else}
					<El style="height: 300px" d="flex" alignItems="center" justifyContent="center">
					  There is no form submitted from this page!
					</El>
				  {/if}
				</TabPanel>
			  </CardBody>
			  <CardFooter>
				<ButtonList ms="auto">
				  <Button on:click={openRemoveConfirmModal} color="danger">
					{t('buttons.remove')}
				  </Button>
				  <Button href="/admin/pages">{t('buttons.cancel')}</Button>
				  <Button on:click={updatePage} color="primary">{t('buttons.save')}</Button>
				</ButtonList>
			  </CardFooter>
			</TabContent>
		  </Card>
		</Tabs>
    {:else}
    <El>this componentn is seleldted {selectedComponent}</El>
    {/if}

	</El>
	<El col = 10  >
     <Editor bind:page = {data.page} bind:selectedComponent>
    {#key JSON.stringify(data)}
		  {#if data.page.dir === 'rtl' }
			  <div style="display: contents;" dir='rtl'>
				  {@html data.html}
			  </div>
			{:else }
			  {@html data.html}
			{/if}
      <pre>
      {JSON.stringify(data.page, null , 3)}
    </pre>
    
		  {/key}
      </Editor>
	</El>
  </El>
<!-- </El> -->
<!-- </Page> -->

<style>
  :global(.y-el-p-0 .y-accordion-body-inner) {
    padding: 0;
  }
  :global(.y-el-p-0 .y-accordion-header-button) {
    padding: 0;
  }
  :global(.y-accordion-header-button::after) {
    content: unset;
  }
</style>
