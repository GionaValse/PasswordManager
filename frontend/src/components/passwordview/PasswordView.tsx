import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit2Icon, StarIcon, StarOffIcon, Trash2Icon, XIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type {
  PasswordCreateDto,
  PasswordResponseDto,
  ResponseError,
} from 'shared-password-manager/api';
import { useModal, useOtp } from 'shared-password-manager/hooks';
import {
  CheckboxView,
  ErrorBoxView,
  ExtraAction,
  HeaderView,
  InputView,
  LoadingView,
  ProgressbarView,
  QrCodeView,
  SubmitButton,
} from 'shared-password-manager/ui';
import { formatRelativeDate, parseApiError, QrCodeService } from 'shared-password-manager/utils';
import { passwordsApi } from '../../apiconfig';
import ConfirmModalDialog from '../modals/confirmmodaldialog/ConfirmModalDialog';
import styles from './PasswordView.module.css';

interface CurrentPasswordViewProps {
  initialData: PasswordResponseDto;
  isNewPassword: boolean;
  vaultId: string;
  passwordId: string;
}

const handleQuery = async ({
  queryKey,
}: {
  queryKey: [string, string | undefined];
}): Promise<PasswordResponseDto | null> => {
  const [_key, id] = queryKey;

  if (!id) return null;

  console.log(id, _key);
  if (id === 'add-password')
    return {
      id: '',
      vaultId: '',
      service: '',
      username: '',
      website: '',
      password: '',
      otpCode: '',
      favorite: false,
      haveOtp: false,
      creationDate: new Date(),
      modifiedDate: new Date(),
    };
  return await passwordsApi.passwordsControllerFindOne({ id });
};

export default function PasswordView() {
  const { vaultId, passwordId } = useParams();

  const { data: password, isLoading } = useQuery({
    queryKey: ['password', passwordId],
    queryFn: handleQuery,
    enabled: !!passwordId,
  });

  if (!passwordId) return null;

  if (!password) return <div>Error loading password</div>;

  return (
    <section className={styles.passwordView}>
      {isLoading ? (
        <LoadingView />
      ) : (
        <CurrentPassowrdView
          key={passwordId}
          initialData={password}
          isNewPassword={passwordId === 'add-password'}
          vaultId={vaultId || ''}
          passwordId={password.id || ''}
        />
      )}
    </section>
  );
}

function CurrentPassowrdView({
  initialData,
  isNewPassword,
  vaultId,
  passwordId,
}: CurrentPasswordViewProps) {
  const [editData, setEditData] = useState<PasswordResponseDto>(initialData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { activeModal, open, close } = useModal<'DELETE_CONFIRM'>();
  const { otpTTL, otpMaxTTL } = useOtp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutationSubmit = useMutation({
    mutationFn: async (data: PasswordCreateDto) => {
      if (isNewPassword) {
        const createData: PasswordCreateDto = {
          ...data,
          vaultId,
        };
        return await passwordsApi.passwordsControllerCreateOne({ passwordCreateDto: createData });
      }
      return await passwordsApi.passwordsControllerUpdateOne({
        id: passwordId,
        passwordUpdateDto: data,
      });
    },
    onSuccess: (savedPassword: PasswordResponseDto) => {
      queryClient.invalidateQueries({ queryKey: ['passwords', vaultId] });
      queryClient.setQueryData(['password', savedPassword.id], savedPassword);

      setError(null);
      setIsEditing(false);

      if (isNewPassword) navigate(`/${vaultId}/${savedPassword.id}`, { replace: true });
    },
    onError: async (error: Error) => {
      const parsedError = await parseApiError(error);
      setError(parsedError.message);
      console.error(`Password error:`, parsedError);
    },
  });

  const mutationFavorite = useMutation({
    mutationFn: async (isFavorite: boolean) =>
      await passwordsApi.passwordsControllerUpdateFavorite({
        id: passwordId,
        passwordsControllerUpdateFavoriteRequest: { favorite: isFavorite },
      }),
    onSuccess: (savedPassword: PasswordResponseDto) => {
      queryClient.invalidateQueries({ queryKey: ['passwords', vaultId] });
      queryClient.setQueryData(['password', savedPassword.id], savedPassword);

      setError(null);
    },
    onError: async (error: Error) => {
      setError((await (error as ResponseError).response.json()).message);
      console.error(`Password set favorite error:`, error);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async () => await passwordsApi.passwordsControllerDeleteOne({ id: passwordId }),
    onSuccess: (deletedPassword: PasswordResponseDto) => {
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
      queryClient.removeQueries({ queryKey: ['password', deletedPassword.id] });

      setError(null);
      navigate(`/${vaultId}`, { replace: true });
      close();
    },
    onError: async (error: Error) => {
      setError((await (error as ResponseError).response.json()).message);
      console.error(`Password delete error:`, error);
      close();
    },
  });

  const validateForm = (formElement: HTMLFormElement | null) => {
    if (formElement) setIsFormValid(formElement.checkValidity());
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutationSubmit.mutate(editData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, form } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    validateForm(form);
  };

  const handleOtpChange = (haveOtp: boolean) => {
    setEditData((prev) => ({ ...prev, haveOtp }));
    validateForm(null);
  };

  const handleFavorite = async () => {
    if (!editData.id) return;
    mutationFavorite.mutate(!initialData.favorite);
  };

  const handleDelete = async () => {
    if (!editData.id) return;
    open('DELETE_CONFIRM');
  };

  const toggleEdit = () => {
    const newEditingState = !isEditing;
    setEditData(initialData);
    setIsEditing(newEditingState);
    if (!newEditingState) setIsFormValid(false);
  };

  return (
    <>
      <HeaderView
        title={isNewPassword ? 'New Password' : initialData.service}
        subtitle={isEditing ? 'Editing' : ''}
        onBack={() => navigate(-1)}
      >
        {isNewPassword ? (
          <ExtraAction
            tooltipText={'Cancel creation'}
            tooltipPosition={'bottomLeft'}
            onExtraClick={() => navigate(`/${vaultId}`, { replace: true })}
          >
            <XIcon size={18} />
          </ExtraAction>
        ) : (
          <>
            {!isEditing && (
              <ExtraAction
                id="password-favorite-action"
                tooltipText={editData.favorite ? 'Remove from favorite' : 'Add to favorite'}
                tooltipPosition={'bottom'}
                onExtraClick={handleFavorite}
              >
                {initialData.favorite ? <StarOffIcon size={18} /> : <StarIcon size={18} />}
              </ExtraAction>
            )}
            <ExtraAction
              id="password-edit-action"
              tooltipText={isEditing ? 'Cancel editing' : 'Edit'}
              tooltipPosition={isEditing ? 'bottomLeft' : 'bottom'}
              onExtraClick={toggleEdit}
            >
              {isEditing ? <XIcon size={18} /> : <Edit2Icon size={18} />}
            </ExtraAction>
            {!isEditing && (
              <ExtraAction
                id="password-delete-action"
                tooltipText="Delete password"
                tooltipPosition={'bottomLeft'}
                onExtraClick={handleDelete}
              >
                <Trash2Icon size={18} />
              </ExtraAction>
            )}
          </>
        )}
      </HeaderView>
      <div className={styles.passwordViewContent}>
        <ErrorBoxView errorMessage={error} />
        <form
          onSubmit={handleSubmit}
          onInput={(e: React.InputEvent<HTMLFormElement>) => validateForm(e.currentTarget)}
        >
          {(isEditing || isNewPassword) && (
            <InputView
              id="service"
              type="text"
              value={editData.service}
              onChange={handleChange}
              label="Name"
              required={true}
            />
          )}
          <InputView
            id="website"
            type="url"
            value={editData.website}
            onChange={handleChange}
            label="Website"
            required={true}
            readOnly={!isEditing && !isNewPassword}
          />
          <InputView
            id="username"
            type="text"
            value={editData.username}
            onChange={handleChange}
            label="Username"
            required={true}
            readOnly={!isEditing && !isNewPassword}
            enableCopy={!isNewPassword}
          />
          <InputView
            id="password"
            type="password"
            value={editData.password}
            onChange={handleChange}
            label="Password"
            required={true}
            readOnly={!isEditing && !isNewPassword}
            enableCopy={!isNewPassword}
          />
          {(isEditing || isNewPassword) && (
            <>
              <CheckboxView
                checked={editData.haveOtp}
                onChange={handleOtpChange}
                label="Use One-Time Password (OTP)"
              />
              <SubmitButton
                text={isNewPassword ? 'Add' : 'Save'}
                align="right"
                disabled={!isFormValid || mutationSubmit.isPending}
              />
            </>
          )}
        </form>
        {!isEditing && !isNewPassword && editData.haveOtp && (
          <>
            <div className="divider"></div>
            <div className={styles.otpContainer}>
              <h3>{editData.otpCode}</h3>
              <div className={styles.countdown}>
                <ProgressbarView progress={otpTTL} max={otpMaxTTL} />
                <span>{Math.ceil(otpTTL / 1000)}s</span>
              </div>
            </div>
          </>
        )}
        <div className="divider"></div>
        {!isNewPassword && (
          <>
            <br />
            <span className={styles.passwordDate}>
              Created: {formatRelativeDate(editData.creationDate)}
            </span>
            <br />
            <span className={styles.passwordDate}>
              Last modified: {formatRelativeDate(editData.modifiedDate)}
            </span>
            <br />
            <div className={styles.qrInfoDivider}></div>
            {!isEditing && (
              <QrCodeView url={JSON.stringify(QrCodeService.getQrCodeFromPassword(editData))} />
            )}
          </>
        )}
      </div>

      <ConfirmModalDialog
        isOpen={activeModal === 'DELETE_CONFIRM'}
        title="Delete vault"
        subtitle="Do you really want to delete the vault?"
        icon={<Trash2Icon />}
        onClose={close}
        onConfirm={() => mutationDelete.mutate()}
      />
    </>
  );
}
