import { IExpanded } from '../pages/Dashboard';
import { IDeployment, ISettings } from '../types';
import { canBeDeployed } from '../utils/validationService';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownSeparator,
  DropdownToggle,
  InputGroup,
  KebabToggle,
  OverflowMenu,
  OverflowMenuControl,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import {
  BellIcon,
  CatalogIcon,
  CheckIcon,
  CubesIcon,
  PencilAltIcon,
  PlayIcon,
  StopIcon,
  ThIcon,
  TimesIcon,
} from '@patternfly/react-icons';
import { useState } from 'react';

export interface IKaotoToolbar {
  deployment?: IDeployment;
  expanded: IExpanded;
  handleExpanded: (newState: IExpanded) => void;
  handleStartDeploy: () => void;
  handleStopDeploy: () => void;
  handleUpdateName: (val: any) => void;
  settings: ISettings;
}

export const KaotoToolbar = ({
  deployment,
  expanded,
  handleExpanded,
  handleStartDeploy,
  handleStopDeploy,
  handleUpdateName,
  settings,
}: IKaotoToolbar) => {
  const [kebabIsOpen, setKebabIsOpen] = useState(false);
  const [appMenuIsOpen, setAppMenuIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState<string>(settings.integrationName);

  const handleDeployStartClick = () => {
    handleStartDeploy();
  };

  const handleDeployStopClick = () => {
    handleStopDeploy();
  };

  const onFocusAppMenu = () => {
    const element = document.getElementById('toggle-icon-only');
    element?.focus();
  };

  const onSelectAppMenu = () => {
    setAppMenuIsOpen(false);
    onFocusAppMenu();
  };

  const appMenuItems = [
    <DropdownItem
      key="deployments"
      description="Integrations that are currently running"
      icon={<CubesIcon />}
      onClick={() => {
        handleExpanded({ ...expanded, deploymentsModal: !expanded.deploymentsModal });
      }}
    >
      Deployments
    </DropdownItem>,
    <DropdownItem
      key="integrations"
      component="button"
      icon={<BellIcon />}
      description="Your saved integrations"
      isDisabled
    >
      Integrations (coming soon)
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="clusters" isDisabled>
      Clusters (coming soon)
    </DropdownItem>,
    <DropdownItem key="projects" component="button" isDisabled>
      Projects (coming soon)
    </DropdownItem>,
  ];

  const kebabItems = [
    <DropdownItem
      key="settings"
      onClick={() => handleExpanded({ settingsModal: !expanded.settingsModal })}
    >
      Settings
    </DropdownItem>,
    <DropdownItem key="tutorial" isDisabled>
      Tutorial
    </DropdownItem>,
    <DropdownItem key="help" isDisabled>
      Help
    </DropdownItem>,
    <DropdownItem key="feedback" isDisabled>
      Feedback
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="delete" component="button" isDisabled>
      Delete
    </DropdownItem>,
  ];

  return (
    <Toolbar className={'viz-toolbar'} data-testid={'viz-toolbar'}>
      <ToolbarContent>
        <ToolbarItem>
          <Dropdown
            onSelect={onSelectAppMenu}
            toggle={
              <DropdownToggle
                toggleIndicator={null}
                onToggle={(e) => setAppMenuIsOpen(e)}
                aria-label="Applications"
                id="toggle-icon-only"
              >
                <ThIcon />
              </DropdownToggle>
            }
            isOpen={appMenuIsOpen}
            isPlain
            dropdownItems={appMenuItems}
          />
        </ToolbarItem>

        <ToolbarItem variant="separator" />

        <ToolbarItem variant="label">
          {isEditingName ? (
            <InputGroup>
              <TextInput
                name="edit-integration-name"
                id="edit-integration-name"
                type="text"
                onChange={(val) => {
                  handleUpdateName(val);
                  setLocalName(val);
                }}
                value={localName}
                aria-label="edit integration name"
              />
              <Button
                variant="control"
                aria-label="save button for editing integration name"
                onClick={() => {
                  setIsEditingName(false);
                }}
              >
                <CheckIcon />
              </Button>
              <Button
                variant="control"
                aria-label="close button for editing integration name"
                onClick={() => {
                  setIsEditingName(false);
                }}
              >
                <TimesIcon />
              </Button>
            </InputGroup>
          ) : (
            <>
              {settings.integrationName ?? 'Integration'}&nbsp;&nbsp;
              <Button
                variant={'link'}
                onClick={() => {
                  setIsEditingName(true);
                }}
              >
                <PencilAltIcon />
              </Button>
            </>
          )}
        </ToolbarItem>

        <ToolbarItem variant="separator" />

        <ToolbarItem>
          <Tooltip content={<div>Step Catalog</div>} position={'bottom'}>
            <Button
              tabIndex={0}
              variant="link"
              data-testid={'toolbar-step-catalog-btn'}
              icon={<CatalogIcon />}
              onClick={() => handleExpanded({ catalog: !expanded.catalog, codeEditor: false })}
            />
          </Tooltip>
        </ToolbarItem>

        {deployment ? (
          <ToolbarItem alignment={{ default: 'alignRight' }}>
            <div className="status-container" data-testid={'toolbar-deployment-status'}>
              <div className={`dot-${deployment.status}`}></div>
              <div className="text">{deployment.status}</div>
            </div>
          </ToolbarItem>
        ) : (
          <ToolbarItem alignment={{ default: 'alignRight' }}>
            <div className="status-container" data-testid={'toolbar-deployment-status'}>
              <div className="dot"></div>
              <div className="text">Running</div>
            </div>
          </ToolbarItem>
        )}

        {deployment && <ToolbarItem variant="separator" />}

        <ToolbarItem>
          <Button
            variant={expanded.codeEditor ? 'primary' : 'secondary'}
            data-testid={'toolbar-show-code-btn'}
            onClick={() => handleExpanded({ codeEditor: !expanded.codeEditor, catalog: false })}
          >
            Code
          </Button>
        </ToolbarItem>

        {/*<ToolbarItem>*/}
        {/*  <Button*/}
        {/*    variant="primary"*/}
        {/*    data-testid={'toolbar-save-btn'}*/}
        {/*    onClick={() => alert('YAY')}*/}
        {/*    isDisabled*/}
        {/*  >*/}
        {/*    Save*/}
        {/*  </Button>*/}
        {/*</ToolbarItem>*/}

        {canBeDeployed() ? (
          <ToolbarItem>
            <Tooltip content={<div>Deploy</div>} position={'bottom'}>
              <Button
                tabIndex={0}
                variant="link"
                data-testid={'toolbar-deploy-start-btn'}
                icon={<PlayIcon />}
                onClick={handleDeployStartClick}
              />
            </Tooltip>
          </ToolbarItem>
        ) : (
          <ToolbarItem>
            <Tooltip content={<div>Stop</div>} position={'bottom'}>
              <Button
                tabIndex={0}
                variant="link"
                icon={<StopIcon />}
                data-testid={'toolbar-deploy-stop-btn'}
                onClick={handleDeployStopClick}
                isDisabled={true}
              />
            </Tooltip>
          </ToolbarItem>
        )}

        <ToolbarItem variant="overflow-menu">
          <OverflowMenu breakpoint="2xl">
            <OverflowMenuControl hasAdditionalOptions>
              <Dropdown
                position={DropdownPosition.right}
                toggle={<KebabToggle onToggle={(val) => setKebabIsOpen(val)} />}
                isOpen={kebabIsOpen}
                isPlain
                data-testid={'toolbar-kebab-dropdown-btn'}
                dropdownItems={kebabItems}
              />
            </OverflowMenuControl>
          </OverflowMenu>
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};
